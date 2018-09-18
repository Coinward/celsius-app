import Branch, {BranchEvent} from "react-native-branch";
import { Constants } from 'expo';
import ACTIONS from "../../config/constants/ACTIONS";
import * as transfersActions from '../transfers/transfersActions';
import * as uiActions from '../ui/uiActions';
import { BRANCH_LINKS, MODALS } from "../../config/constants/common";
import API from "../../config/constants/API";
import { apiError, startApiCall } from "../api/apiActions";

export {
  registerBranchLink,
  createBranchLink,
  createBranchReferralLink,
}

function createBranchLink(linkType, canonicalIdentifier, properties) {
  if (Constants.appOwnership !== 'standalone') return;

  return async (dispatch, getState) => {
    try {
      dispatch(startApiCall(API.CREATE_BRANCH_LINK));
      const { user } = getState().users;
      const branchObject = await Branch.createBranchUniversalObject(canonicalIdentifier, properties);

      Branch.setIdentity(user.email);
      branchObject.logEvent(BranchEvent.ViewItem);

      const { url } = await branchObject.generateShortUrl();

      dispatch({
        type: ACTIONS.CREATE_BRANCH_LINK_SUCCESS,
        branchLink: {
          linkType,
          branchObject,
          url,
        }
      });
    } catch(err) {
      dispatch(apiError(API.CREATE_BRANCH_LINK, err));
    }
  }
}

function createBranchReferralLink() {
  return (dispatch, getState) => {
    const { user } = getState().users;
    dispatch(createBranchLink(
      BRANCH_LINKS.REFERRAL,
      `referral:${user.email}`,
      {
        locallyIndex: true,
        title: 'Download the App Now to Earn Interest Like Me',
        contentImageUrl: 'https://image.ibb.co/jWfnh9/referall_image.png',
        contentDescription: 'Deposit coins & earn up to 5% interest annually on BTC, ETH, LTC and more.'
      }
    ))
  }
}

function registerBranchLink(deepLink) {
  return (dispatch, getState) => {
    dispatch({
      type: ACTIONS.BRANCH_LINK_REGISTERED,
      link: deepLink,
    })

    switch (deepLink.link_type) {
      case BRANCH_LINKS.TRANSFER:
        dispatch(uiActions.openModal(MODALS.TRANSFER_RECEIVED));
        if (getState().users.user) {
          dispatch(transfersActions.claimTransfer(deepLink.transfer_hash));
        }
        break;
      default:

    }
  }
}
