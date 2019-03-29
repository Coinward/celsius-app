import React, { Component } from "react";
import { View } from "react-native";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import ApiKeySuccessModalStyle from "./ApiKeySuccessModal.styles";
import CelText from "../../atoms/CelText/CelText";
import CelModal from "../CelModal/CelModal";
import Separator from "../../atoms/Separator/Separator";
import CopyButton from "../../atoms/CopyButton/CopyButton";
import ShareButton from "../../atoms/ShareButton/ShareButton";
import CelButton from "../../atoms/CelButton/CelButton";
import { MODALS } from "../../../constants/UI";

@connect(
  state => ({
    apiKey: state.apiKeys.lastGeneratedKey
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ApiKeySuccessModal extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {actions, apiKey} = this.props;
    const style = ApiKeySuccessModalStyle();

    return (
      <CelModal
        name={MODALS.GENERATE_API_KEY_MODAL}
      >
        <CelText margin={"10 0 10 0"} align={"center"} weight={"600"} type={"H2"}>Your API key was successfully generated</CelText>
        <CelText weight={"300"} type={"H4"}>
          Please note that the key won’t be fully readable after you close this modal.
          We suggest you copy the key, and store it somewhere safe.
        </CelText>

        <View style={style.copyShareWrapper}>
          <CelText align={"center"} weigth={"400"} type={"H4"}>{apiKey}</CelText>
          <Separator margin={"20 0 0 0"} />
          <View style={style.copyShareButtonsWrapper}>
            <CopyButton copyText={apiKey} onCopy={() => actions.showMessage("success", "API key copied to clipboard!")} />
            <Separator vertical />
            <ShareButton shareText={apiKey}/>
          </View>
        </View>

        <CelButton
          margin={"20 0 20 0"}
          onPress={() => {
            actions.updateFormFields({
              readWalletBalance: false,
              readTransactions: false,
              readDeposits: false,
              readWithdrawals: false
            });
            actions.closeModal()
          }}
        >
          Continue
        </CelButton>
      </CelModal>
    );
  }
}

export default testUtil.hookComponent(ApiKeySuccessModal);
