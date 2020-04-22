import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import Banner from "../../molecules/Banner/Banner";
import STYLES from "../../../constants/STYLES";
import { MODALS } from "../../../constants/UI";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";

class ReferralTrigger extends Component {
  static propTypes = {
    actions: PropTypes.instanceOf(Object),
  };
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { actions } = this.props;

    const content =
      "\n" +
      "Earn even more when others sign up for Celsius with your referral code!" +
      "\n";

    return (
      <Banner
        backgroundColor={STYLES.COLORS.CELSIUS_BLUE}
        image={require("../../../../assets/images/present-image.png")}
        action={() => {
          actions.openModal(MODALS.REFERRAL_SEND_MODAL);
          mixpanelAnalytics.userStartingReferral();
        }}
        buttonText={"Share code"}
        textButtonText={"Don't show"}
        textButtonAction={() => {
          actions.setUserAppSettings({
            user_triggered_actions: {
              bannerResurrectionDay: moment(moment.utc().format())
                .add(30, "days")
                .utc()
                .format(),
            },
          });
          actions.closeBanner();
        }}
        title={"Refer & Earn!"}
        content={content}
        close={() => actions.closeBanner()}
      />
    );
  }
}

export default ReferralTrigger;
