import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import * as moment from "moment";

import HodlBannerStyle from "./HodlBanner.styles";
import CelText from "../../atoms/CelText/CelText";

class HodlBanner extends Component {
  static propTypes = {
    // text: PropTypes.string,
    status: PropTypes.string,
    navigateTo: PropTypes.func,
    activeScreen: PropTypes.string,
  };
  static defaultProps = {};

  render() {
    const style = HodlBannerStyle();
    const { status, navigateTo, activeScreen } = this.props;
    if (!status.isActive) return null;

    const now = moment.utc();
    const deactivatedAt = moment.utc(status.deactivated_at);
    const diff = deactivatedAt.diff(now);
    const hours = Math.abs(moment.duration(diff).hours());
    const minutes = Math.abs(moment.duration(diff).minutes());

    const isDisabled =
      status.state !== "Activated" || activeScreen === "VerifyProfile";

    return (
      <TouchableOpacity
        style={style.container}
        disabled={isDisabled}
        onPress={() => navigateTo("HodlEmptyScreen")}
      >
        {status.state === "Activated" ? (
          <CelText
            font={"RobotoMono"}
            weight="regular"
            type={"H6"}
            color={"white"}
          >
            HODL MODE: ON
          </CelText>
        ) : (
          <CelText
            font={"RobotoMono"}
            weight="regular"
            type={"H6"}
            color={"white"}
          >
            {`EXITING HODL MODE: ${hours}H ${minutes}M`}
          </CelText>
        )}
      </TouchableOpacity>
    );
  }
}

export default HodlBanner;
