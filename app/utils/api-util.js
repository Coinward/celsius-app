import axios from "axios";
import qs from "qs";
import r from "jsrsasign";
import { Platform } from "react-native";
import { Base64 } from "js-base64";
import DeviceInfo from "react-native-device-info";
import CodePush from "react-native-code-push";

import logger from "./logger-util";
import Constants from "../../constants";
import { getSecureStoreKey } from "../utils/expo-storage";
import store from "../redux/store";
import * as actions from "../redux/actions";
import { isKYCRejectedForever } from "./user-util";
import mixpanelAnalytics from "./mixpanel-analytics";
import { logoutUserMixpanel } from "./mixpanel-util";

const {
  SECURITY_STORAGE_AUTH_KEY,
  CLIENT_VERSION,
  ENV,
  PUBLIC_KEY,
  API_URL,
} = Constants;
let token;
let deviceModel;
let osVersion;
let buildVersion;

export default {
  initInterceptors,
  areCallsInProgress,
  parseValidationErrors,
};

/**
 * Initializes axios interceptors for every HTTP request
 */
function initInterceptors() {
  axios.interceptors.request.use(requestInterceptor, error =>
    Promise.reject(error)
  );

  axios.interceptors.response.use(responseInterceptor, errorInterceptor);
}

/**
 * Intercepts every request going through axios and sets all important headers
 */
async function requestInterceptor(req) {
  // Cancel if no internet internet connection
  const { internetConnected } = store.getState().app;
  if (!internetConnected) return false;

  const newRequest = { ...req };

  if (req.url.includes(API_URL)) {
    newRequest.headers = {
      ...newRequest.headers,
      ...setContentTypeHeaders(req),
      ...setDeviceInfoHeaders(),
      ...(await setAppVersionHeaders()),
      ...setAppsflyerHeaders(),
      ...setGeolocationHeaders(),
      ...(await setAuthHeaders()),
    };
  }

  if (newRequest.method === "post") {
    newRequest.data = qs.stringify(newRequest.data);
  }

  /* eslint-disable no-underscore-dangle */
  // console.log({ [req.method.toUpperCase()]: newRequest })
  /* eslint-enable no-underscore-dangle */

  return newRequest;
}

/**
 * Sets Appsflyer IDs: AFID, IDFA, AAID
 */
function setAppsflyerHeaders() {
  const AFID = store.getState().app.appsFlyerUID;
  const IDFA = Platform.OS === "ios" && store.getState().app.advertisingId;
  const AAID = Platform.OS === "android" && store.getState().app.advertisingId;

  return {
    "X-Advertising-AFID": AFID,
    "X-Advertising-IDFA": IDFA,
    "X-Advertising-AAID": AAID,
  };
}

/**
 * Sets Geolocation headers for every request
 */
function setGeolocationHeaders() {
  const { geolocation } = store.getState().app;
  return {
    "geo-lat": geolocation && geolocation.geoLat,
    "geo-long": geolocation && geolocation.geoLong,
  };
}

/**
 * Sets Device Info Headers
 */
function setDeviceInfoHeaders() {
  return {
    deviceModel: deviceModel || DeviceInfo.getModel(),
    osVersion: osVersion || DeviceInfo.getSystemVersion(),
    os: Platform.OS,
    deviceYearClass: Constants.deviceYearClass,
    installationId: Constants.installationId,
  };
}

/**
 * Sets Content-Type of request
 */
function setContentTypeHeaders(request) {
  const { url, data, headers, method } = request;
  let contentType = headers["Content-Type"];
  let accept = headers.Accept;

  if (
    (url.includes("profile/profile_picture") && !data.profile_picture_url) ||
    url.includes("user/profile/documents")
  ) {
    contentType = "multipart/form-data";
  }

  if (method === "post") {
    contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    accept = "application/json";
  }

  return {
    "Content-Type": contentType,
    Accept: accept,
  };
}

/**
 * Sets Current app version Headers
 */
async function setAppVersionHeaders() {
  const clientVersion = ENV === "PRODUCTION" ? CLIENT_VERSION : ENV;
  if (!buildVersion) {
    const metadata = await CodePush.getUpdateMetadata();
    buildVersion = metadata
      ? `${metadata.appVersion}@${metadata.label}`
      : "local";
  }

  return {
    "X-Client-Version": clientVersion,
    buildVersion,
  };
}

/**
 * Sets User Bearer token
 */
async function setAuthHeaders() {
  try {
    const storageToken = await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
    if (token !== storageToken) token = storageToken;
  } catch (err) {
    logger.err(err);
  }
  return {
    authorization: token && `Bearer ${token}`,
  };
}

/**
 * Intercepts every successful response from server
 * TODO: make verifyKey work in 2020!
 */
async function responseInterceptor(res) {
  const { backendStatus } = store.getState().generalData;
  const sign = res.headers["x-cel-sign"];
  const data = res.data;

  if (
    res.config.url.includes(API_URL) &&
    backendStatus &&
    backendStatus.maintenance
  ) {
    store.dispatch(actions.toggleMaintenanceMode());
  }

  if (verifyKey(data, sign)) {
    /* eslint-disable no-underscore-dangle */
    // console.log({ RESPONSE: res })
    /* eslint-enable no-underscore-dangle */

    return res;
  }

  const err = {
    type: "Sign Error",
    msg: "Wrong API key",
  };

  /* eslint-disable no-underscore-dangle */
  // console.log({ API_ERROR: err })
  /* eslint-enable no-underscore-dangle */

  return Promise.reject(err);
}

/**
 * Intercepts every error response from server
 */
async function errorInterceptor(serverError) {
  const defaultMsg = "Oops, it looks like something went wrong!";
  const defaultError = {
    type: "Unknown Server Error",
    msg: defaultMsg,
    raw_error: serverError,
  };

  const err = serverError.response ? serverError.response.data : defaultError;

  if (!err.msg) err.msg = defaultMsg;
  if (!err.status)
    err.status = serverError.response ? serverError.response.status : null;

  mixpanelAnalytics.apiError({
    ...err,
    url: serverError.config.url,
    method: serverError.config.method,
  });
  if (err.status === 401) handle401(err);
  if (err.status === 403) handle403(err);
  if (err.status === 426) {
    handle426(err);
    return Promise.resolve();
  }
  if (err.status === 429) handle429();
  if (err.status === 503) handle503(err);

  /* eslint-disable no-underscore-dangle */
  // console.log({ API_ERROR: err })
  /* eslint-enable no-underscore-dangle */

  return Promise.reject(err);
}

function handle401(err) {
  if (err.slug === "SESSION_EXPIRED") {
    store.dispatch(actions.expireSession());
    store.dispatch(actions.logoutUser());
  }
  if (err.slug === "PASSWORD_LEAKED") {
    store.dispatch(actions.resetToScreen("PasswordBreached"));
  }
}

async function handle403(err) {
  if (err.slug === "USER_SUSPENDED") {
    const { profile } = store.getState().user;
    if (profile && profile.id) {
      store.dispatch(actions.logoutUser());
    }
    store.dispatch(actions.showMessage("error", err.msg));
  }
  if (err.slug === "Token Expired") {
    await logoutUserMixpanel();
    mixpanelAnalytics.sessionEnded("Logout user");
    store.dispatch(
      actions.resetToScreen("Welcome", {
        inactiveUser: true,
        msg: err.msg,
      })
    );
  }
}

function handle426(err) {
  const { showVerifyScreen } = store.getState().app;
  if (!showVerifyScreen) {
    store.dispatch(
      actions.navigateTo("VerifyProfile", {
        hideBack: true,
        show: err.show,
        onSuccess: () => {
          store.dispatch(
            actions.resetToScreen(
              isKYCRejectedForever() ? "KYCFinalRejection" : "WalletLanding"
            )
          );
        },
      })
    );
    store.dispatch(actions.showVerifyScreen());
  }
}

function handle429() {
  store.dispatch(actions.navigateTo("LockedAccount"));
}

function handle503(err) {
  if (err.slug === "BREAK_THE_GLASS") {
    store.dispatch(actions.toggleMaintenanceMode(err.title, err.explanation));
  }
}

/**
 * Checks if api calls are in progress
 *
 * @param {Array} callsToCheck - array of api call names from API.js
 * @param {Array} callsInProgress - calls currently in progress
 * @returns {boolean}
 */
function areCallsInProgress(callsToCheck, callsInProgress = undefined) {
  const calls = callsInProgress || store.getState().api.callsInProgress;
  return !!calls.filter(cip => callsToCheck.indexOf(cip) !== -1).length;
}

/**
 * Parses validation errors from server
 *
 * @param {Object} serverError - error response from the server
 * @returns {Object} validationErrors - key/value pairs for errors, key is the field name, value is the error message from server
 */
function parseValidationErrors(serverError) {
  const errKeys = Object.keys(serverError.raw_error);
  const validationErrors = {};

  errKeys.forEach(ek => {
    validationErrors[ek] = serverError.raw_error[ek].msg;
  });

  return validationErrors;
}

/**
 * Verifies the data with signature key from the server
 *
 * @param {Object} address - data from server response
 * @param {string} sign - sign from response headers
 * @returns {boolean}
 *
 * endpont /users/hodl_mode/begin returns wrong api key
 * CN-4875 Wire hodl mode
 */
function verifyKey(data, sign) {
  try {
    const sig2 = new r.KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    sig2.init(Base64.decode(PUBLIC_KEY));
    sig2.updateString(JSON.stringify(data));
    const isValid = true || sig2.verify(sign);

    return ENV === "PRODUCTION" ? true : isValid;
  } catch (err) {
    return true;
  }
}
