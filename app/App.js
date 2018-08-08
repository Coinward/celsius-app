import React, {Component} from 'react';
import { Asset, AppLoading, Font, Constants } from 'expo';
import Branch from 'react-native-branch';
import {Provider} from 'react-redux';
import { Image, AsyncStorage, NetInfo} from 'react-native';
import twitter from 'react-native-simple-twitter';
import Sentry from 'sentry-expo';

import store from './redux/store';
import apiUtil from './utils/api-util';
import * as actions from './redux/actions';
import MainLayout from './components/layouts/MainLayout';
import {CACHE_IMAGES, FONTS} from "./config/constants/style";
import {getSecureStoreKey, deleteSecureStoreKey, setSecureStoreKey} from "./utils/expo-storage";
import baseUrl from "./services/api-url";

// const { Branch } = DangerZone;
//
// console.log(Branch);

const {SENTRY_DSN, TWITTER_CUSTOMER_KEY, TWITTER_SECRET_KEY, SECURITY_STORAGE_AUTH_KEY, ENV} = Constants.manifest.extra;

if (SENTRY_DSN) {
  Sentry.enableInExpoDevelopment = true;
  Sentry.config(SENTRY_DSN).install();
}

if (ENV !== 'PRODUCTION') {
  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
}

AsyncStorage.removeItem('UserTemporaryId'); // reset temporary user id for mixpanel tracking

// Initialize axios interceptors
apiUtil.initInterceptors();

// For images that saved to the local file system,
// use Expo.Asset.fromModule(image).downloadAsync()
// to download and cache the image.
// There is also a loadAsync() helper method to cache a batch of assets.
// For web images, use Image.prefetch(image).
// Continue referencing the image normally,
// e.g. with <Image source={require('path/to/image.png')} />
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }

    return Asset.fromModule(image).downloadAsync();
  });
}

// Fonts are preloaded using Expo.Font.loadAsync(font).
// The font argument in this case is an object such as the following:
// {agile-medium: require('../assets/fonts/Agile-Medium.otf')}.
function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

function handleConnectivityChange(isConnected) {
  store.dispatch(actions.setInternetConnectivity(isConnected));
}

function handleDeepLink(deepLink) {
  if (!deepLink || !deepLink['+clicked_branch_link']) {
    return;
  }

  const date = new Date().toISOString();

  store.dispatch(actions.showMessage('error', 'Link recieved'));
  Sentry.captureMessage(`Application read branch link [${date}]`, {
    level: 'info',
    extra: {
      deepLink,
    },
  });
}

export default class App extends Component {
  // Init Application
  static async initApp() {
    await App.loadAssetsAsync();

    if (!SECURITY_STORAGE_AUTH_KEY) {
      console.error('NO SECURITY_STORAGE_AUTH_KEY')
    }

    // logout user if backend environment has changed
    const previousBaseUrl = await getSecureStoreKey('BASE_URL');
    if (previousBaseUrl !== baseUrl) {
      await deleteSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
      await setSecureStoreKey('BASE_URL', baseUrl);
    }

    // get user token
    const token = await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
    // get user from db
    if (token) {
      await store.dispatch(actions.getLoggedInBorrower());
    }

    // gete user app setting
    const appSettings = await getSecureStoreKey('APP_SETTINGS');
    if (appSettings) {
      store.dispatch(actions.updateUserAppSettings(JSON.parse(appSettings)));
    }

    store.dispatch(actions.getSupportedCurrencies())

    // init twitter login service
    twitter.setConsumerKey(TWITTER_CUSTOMER_KEY, TWITTER_SECRET_KEY);

    await store.dispatch(actions.getSupportedCurrencies());

    const initialConnection = await NetInfo.isConnected.fetch();

    handleConnectivityChange(initialConnection);

    // const handleUrl = ({url}) => {
    //   const queryString = url.replace(Constants.linkingUri, '');
    //
    //   if (queryString) {
    //     Sentry.captureMessage("Expo URL Handler", {
    //       level: 'info',
    //       extra: {
    //         url,
    //         queryString,
    //       },
    //     });
    //   }
    // };

    try {
      // const initialUrl = await Linking.getInitialURL();
      //
      // Linking.addEventListener('url', handleUrl);
      //
      // Sentry.captureMessage("Initial URL Handling", {
      //   level: 'info',
      //   extra: {
      //     initialUrl,
      //     linkingUri: Constants.linkingUri,
      //   },
      // });
      //
      // const branchUniversalObject = await Branch.createBranchUniversalObject('testing123Celsius', {
      //   locallyIndex: true,
      //   title: 'You got money!',
      //   contentDescription: 'Filip has sent you money on Celsius Network',
      //   contentMetadata: {
      //     amount: 0.124,
      //     currency: 'eth',
      //     amountUsd: '$ 12.34',
      //     customMetadata: {
      //       amount: 123.31,
      //       hash: 'jhsadkfahsjkdfhjgashdjk123',
      //       currency: 'cel',
      //       amountUsd: '$ 21.43'
      //     }
      //   }
      // });
      //
      // const {url} = await branchUniversalObject.generateShortUrl();
      //
      // Sentry.captureMessage("Branch URL Generated", {
      //   level: 'info',
      //   extra: {
      //     url,
      //   },
      // });

      // setTimeout(() => {
        Branch.subscribe((deepLink) => {
          const date = new Date().toISOString();
          Sentry.captureMessage(`Subscribe called [${date}]`, {
            level: 'info',
            extra: {
              deepLink,
            },
          });
          if (deepLink.error || !deepLink.params) {
            return;
          }

          handleDeepLink(deepLink.params);
        });
      // }, 10000);

      // if (Platform.OS === 'ios') {
      //   const lastDeepLink = await Branch.getLatestReferringParams();

        // handleDeepLink(lastDeepLink);
      // }
    } catch (error) {
      Sentry.captureException(error);
    }

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      handleConnectivityChange
    );
  }

  // Assets are cached differently depending on where
  // they’re stored and how they’re used.
  static async loadAssetsAsync() {
    const imageAssets = cacheImages(CACHE_IMAGES);

    const fontAssets = cacheFonts(FONTS);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  constructor() {
    super();

    this.state = {
      isReady: false,
    };
  }

  render() {
    if (!this.state.isReady) {

      // A React component that tells Expo to keep the app loading screen open
      // if it is the first and only component rendered in your app. When it
      // is removed, the loading screen will disappear
      // and your app will be visible.
      //
      // This is incredibly useful to let you download and cache fonts,
      // logo and icon images and other assets that you want to be sure the
      // user has on their device for an optimal experience
      // before rendering they start using the app.
      return (
        <AppLoading
          startAsync={App.initApp}
          onFinish={() => this.setState({isReady: true})}
          /* eslint-disable no-console */
          onError={console.warn}
          /* eslint-disable no-console */
        />
      );
    }

    return (
      <Provider store={store}>
        <MainLayout/>
      </Provider>
    );
  }
}
