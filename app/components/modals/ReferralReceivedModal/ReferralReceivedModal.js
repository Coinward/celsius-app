import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import ReferralReceivedModalStyle from "./ReferralReceivedModal.styles";
import CelModal from "../CelModal/CelModal.js";
import { MODALS } from "../../../constants/UI";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";
import CelModalButton from "../../atoms/CelModalButton/CelModalButton";
import CelText from "../../atoms/CelText/CelText";
import { DEEP_LINKS } from "../../../constants/DATA";
import formatter from "../../../utils/formatter";

class ReferralReceivedModal extends Component {
  static propTypes = {
    referralLink: PropTypes.instanceOf(Object),
    navigateTo: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  closeAndGoToSignup = owner => {
    const { closeModal, navigateTo } = this.props;

    closeModal();
    navigateTo("RegisterInitial");
    mixpanelAnalytics.userReferred(owner);
  };

  render() {
    const { referralLink } = this.props;
    const style = ReferralReceivedModalStyle();

    if (!referralLink) return null;
    const owner = referralLink.owner
      ? referralLink.owner.display_name
      : "a friend";

    return (
      <CelModal name={MODALS.REFERRAL_RECEIVED_MODAL}>
        <View style={{ paddingHorizontal: 20 }}>
          <CelText margin={"0 40 15 40"} align="center" type="H2" weight="bold">
            Welcome to Celsius!
          </CelText>

          {referralLink.link_type === DEEP_LINKS.INDIVIDUAL_REFERRAL && (
            <CelText align="center">
              You have been referred by {owner} and received{" "}
              <CelText weight="bold">
                {referralLink.referred_award_amount}{" "}
                {referralLink.referred_award_base_currency}{" "}
              </CelText>
              as a reward. To see it in your wallet, please sign up and verify
              your profile.
            </CelText>
          )}

          {referralLink.link_type === DEEP_LINKS.COMPANY_REFERRAL && (
            <CelText align="center">
              You will receive{" "}
              <CelText weight="bold">
                {referralLink.referred_award_amount}{" "}
                {referralLink.referred_award_base_currency ||
                  referralLink.referred_award_coin}{" "}
              </CelText>
              {isNaN(referralLink.minimum_deposit_for_reward) ? (
                <CelText>after you verify your account!</CelText>
              ) : (
                <CelText>
                  after your first deposit of{" "}
                  {formatter.usd(referralLink.minimum_deposit_for_reward)} or
                  more!
                </CelText>
              )}
            </CelText>
          )}
        </View>

        <View style={style.buttonWrapper}>
          <CelModalButton onPress={this.closeAndGoToSignup}>
            Signup
          </CelModalButton>
        </View>
      </CelModal>
    );
  }
}

export default ReferralReceivedModal;
