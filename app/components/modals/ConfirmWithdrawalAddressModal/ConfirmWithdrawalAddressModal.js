import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
// import ConfirmWithdrawalAddressModalStyle from "./ConfirmWithdrawalAddressModal.styles";
import CelText from "../../atoms/CelText/CelText";
import CelModal from "../CelModal/CelModal";
import { MODALS } from "../../../constants/UI";
import CelModalButton from "../../atoms/CelModalButton/CelModalButton";
import Card from "../../atoms/Card/Card";
import STYLES from "../../../constants/STYLES";

@connect(
  state => ({
    coin: state.forms.formData.coin,
    withdrawAddress: state.forms.formData.withdrawAddress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ConfirmWithdrawalAddressModal extends Component {
  static propTypes = {
    coin: PropTypes.string.isRequired,
    withdrawalAddress: PropTypes.string.isRequired,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConfirmWithdrawalFromModal = () => {
    const { actions } = this.props;
    actions.navigateTo("VerifyProfile", {
      onSuccess: actions.setCoinWithdrawalAddress,
    });
    actions.closeModal();
  };

  render() {
    const { actions, coin, withdrawAddress } = this.props;
    // const style = ConfirmWithdrawalAddressModalStyle();

    return (
      <CelModal name={MODALS.CONFIRM_WITHDRAWAL_ADDRESS_MODAL}>
        <View style={{ marginHorizontal: 10 }}>
          <CelText
            margin={"0 10 10 10"}
            align={"center"}
            weight="bold"
            type={"H2"}
          >
            Confirm Address
          </CelText>
          <CelText
            weight={"300"}
            type={"H4"}
            align={"center"}
            margin={"0 20 0 20"}
          >
            {`Your new ${coin} withdrawal address`}
          </CelText>
          <Card margin={"20 0 20 0"} color={STYLES.COLORS.LIGHT_GRAY}>
            <CelText type={"H2"} weight={"500"} align={"center"}>
              {withdrawAddress}
            </CelText>
          </Card>
        </View>

        <View style={{ width: "100%", flexDirection: "row" }}>
          <CelModalButton
            position={"left"}
            buttonStyle={"secondary"}
            margin={"20 0 20 0"}
            onPress={() => {
              actions.closeModal();
            }}
          >
            Cancel
          </CelModalButton>
          <CelModalButton
            position={"right"}
            margin={"20 0 20 0"}
            onPress={this.handleConfirmWithdrawalFromModal}
          >
            Confirm
          </CelModalButton>
        </View>
      </CelModal>
    );
  }
}

export default ConfirmWithdrawalAddressModal;
