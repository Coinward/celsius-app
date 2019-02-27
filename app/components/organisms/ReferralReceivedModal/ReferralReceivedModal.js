import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import formatter from "../../../utils/formatter";
import { MODALS, BRANCH_LINKS } from "../../../config/constants/common";
import { GLOBAL_STYLE_DEFINITIONS as globalStyles } from "../../../config/constants/style";
import CelModal from "../../atoms/CelModal/CelModal";
import CelButton from "../../atoms/CelButton/CelButton";

@connect(
  state => ({
    referralLink: state.branch.registeredLink
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ReferralReceivedModal extends Component {
  getModalCopy(branchLink) {
    let modalCopy;
    let sender;
    let amountCopy;
    if (branchLink.link_type === BRANCH_LINKS.INDIVIDUAL_REFERRAL) {
      sender = branchLink.owner ? branchLink.owner.display_name : 'your firend';
      modalCopy = `You and ${ sender } will receive up to $20 in BTC once you join*! Now that’s what we call “friends with benefits,” Clock’s ticking - you have 5 days to reach the minimum deposit!`;
    }
    if (branchLink.link_type === BRANCH_LINKS.COMPANY_REFERRAL) {
      amountCopy = Number(branchLink.minimum_deposit_for_reward) ? ` of ${ formatter.usd(branchLink.minimum_deposit_for_reward) } or more` : '';
      modalCopy = `Thanks for joining Celsius Network! You will receive ${ branchLink.referred_award_amount } in ${ branchLink.referred_award_coin } after your first deposit${amountCopy}!`;
    }

    return modalCopy;
  }

  closeAndGoToSignup = () => {
    const { actions } = this.props;

    actions.closeModal();
    actions.navigateTo("SignupOne");
  };

  render() {
    const { referralLink } = this.props;

    if (!referralLink) return null;

    const copy = this.getModalCopy(referralLink);

    return (
      <CelModal name={MODALS.REFERRAL_RECEIVED_MODAL}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image source={require("../../../../assets/images/hodl-bear.png")}
                 style={{ width: 120, height: 120, borderRadius: 60 }}/>
        </View>

        <Text style={[globalStyles.largeHeading, { marginTop: 15, marginBottom: 10 }]}>
          Welcome to Celsius Network!
        </Text>

        <Text style={[globalStyles.normalText, { textAlign: "center" }]}>
          { copy }
        </Text>

        <CelButton
          onPress={this.closeAndGoToSignup}
          margin="30 0 20 0"
        >
          Sign Up
        </CelButton>

        { referralLink.link_type === BRANCH_LINKS.INDIVIDUAL_REFERRAL && (
          <Text style={[globalStyles.normalText, { textAlign: "center" }]}>
            *$10 in BTC distributed after initial deposit of $1,000 or more. Additional $10 bonus distributed after keeping $1,000 or more for 90 days. Wallet balance value is based on time of deposit.
          </Text>
        )}
      </CelModal>
    );
  }
}

export default ReferralReceivedModal;