import React, { Component } from "react";
import { View, TouchableOpacity, Clipboard, BackHandler } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationEvents } from "react-navigation";
import _ from "lodash";

import * as appActions from "../../../redux/actions";
import VerifyProfileStyle from "./VerifyProfile.styles";
import CelText from "../../atoms/CelText/CelText";
import CelNumpad from "../../molecules/CelNumpad/CelNumpad";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import { KEYPAD_PURPOSES } from "../../../constants/UI";
import HiddenField from "../../atoms/HiddenField/HiddenField";
import Spinner from "../../atoms/Spinner/Spinner";
import CelButton from "../../atoms/CelButton/CelButton";
import ContactSupport from "../../atoms/ContactSupport/ContactSupport";
import { DEEP_LINKS } from "../../../constants/DATA";

@connect(
  state => ({
    appState: state.app.appState,
    formData: state.forms.formData,
    twoFAStatus: state.security.twoFAStatus,
    deepLinkData: state.deepLink.deepLinkData,
    user: state.user.profile,
    previousScreen: state.nav.previousScreen,
    activeScreen: state.nav.activeScreen,
    theme: state.user.appSettings.theme,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class VerifyProfile extends Component {
  static propTypes = {};

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerSameColor: true,
      hideBack: !!(params && (params.show || params.hideBack)) || false,
      right: navigation.getParam("showLogOutBtn", false) && "logout",
      gesturesEnabled: false,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loading: false,
      verificationError: false,
      showLogOutBtn: false,
      hasSixDigitPin: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentDidMount = () => {
    const { navigation, actions, user } = this.props;
    const activeScreen = navigation.getParam("activeScreen");
    const hasSixDigitPin = navigation.getParam("hasSixDigitPin");

    actions.getPreviousPinScreen(activeScreen);
    if (hasSixDigitPin || user.has_six_digit_pin)
      this.setState({ hasSixDigitPin: true });
    if (activeScreen) this.props.navigation.setParams({ hideBack: true });
  };

  componentWillUpdate(nextProps) {
    const { activeScreen } = this.props;

    if (
      activeScreen !== nextProps.activeScreen &&
      nextProps.activeScreen === "VerifyProfile"
    ) {
      this.setState({ value: "" });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  openKeypad = () => {
    const { actions } = this.props;
    actions.toggleKeypad(true);
  };

  onCheckSuccess = async () => {
    this.setState({ loading: true });

    const { navigation, actions, previousScreen, deepLinkData } = this.props;
    const onSuccess = navigation.getParam("onSuccess");
    const activeScreen = navigation.getParam("activeScreen");

    // Check if app is opened from DeepLink
    if (!_.isEmpty(deepLinkData)) {
      if (deepLinkData.type === DEEP_LINKS.NAVIGATE_TO) {
        actions.handleDeepLink();
        return;
      }
    }

    if (activeScreen) {
      if (activeScreen === "VerifyProfile") {
        this.setState({ loading: false });
        actions.resetToScreen(previousScreen || "WalletLanding");
        return;
      }

      actions.navigateTo(activeScreen);
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false });
    onSuccess();
  };

  onCheckError = () => {
    const { actions } = this.props;
    this.setState({ loading: false, value: "", verificationError: true });
    const timeout = setTimeout(() => {
      this.setState({ verificationError: false });

      if (!this.shouldShow2FA()) {
        actions.toggleKeypad(true);
      }

      clearTimeout(timeout);
    }, 5000);
  };

  setForgotPin = () => {
    const { verificationError } = this.state;
    if (verificationError) {
      this.setState({ forgotPin: true });
    }
  };

  getVerificationType = () => {
    const { user, navigation } = this.props;

    // handling 426 error - PIN || 2FA
    const typeFromNavigation = navigation.getParam("verificationType", null);

    const typeFromUser = user.two_factor_enabled ? "2FA" : "PIN";
    return typeFromNavigation || typeFromUser;
  };

  shouldShow2FA = () => this.getVerificationType() === "2FA";

  handleBackButtonClick = () => true;

  handlePINChange = newValue => {
    const { actions } = this.props;
    const { hasSixDigitPin } = this.state;
    const pinLength = hasSixDigitPin ? 6 : 4;

    if (newValue.length > pinLength) return;

    actions.updateFormField("pin", newValue);
    this.setState({ value: newValue });

    if (newValue.length === pinLength) {
      this.setState({ loading: true });
      actions.checkPIN(this.onCheckSuccess, this.onCheckError);
    }
  };

  handle2FAChange = newValue => {
    const { actions } = this.props;
    if (newValue.length > 6) {
      this.setState({ loading: false });
      return;
    }
    this.setState({ value: newValue });
    actions.updateFormField("code", newValue);
    if (newValue.length === 6) {
      actions.toggleKeypad();

      actions.checkTwoFactor(this.onCheckSuccess, this.onCheckError);
    }
  };

  handlePaste = async () => {
    const { actions } = this.props;
    this.setState({ loading: true });
    const code = await Clipboard.getString();

    if (code) {
      this.handle2FAChange(code);
    } else {
      actions.showMessage("warning", "Nothing to paste, please try again!");
      this.setState({ loading: false });
    }
  };

  renderDots = length => {
    const { actions } = this.props;
    const { verificationError, value } = this.state;

    const pinLength = length || 6;
    return (
      <TouchableOpacity onPress={actions.toggleKeypad}>
        <HiddenField
          value={value}
          error={verificationError}
          length={pinLength}
        />
      </TouchableOpacity>
    );
  };

  render2FA() {
    const { loading } = this.state;
    const { actions } = this.props;
    const style = VerifyProfileStyle();

    return (
      <View style={style.wrapper}>
        <CelText type="H1" align="center">
          Verification required
        </CelText>

        <CelText
          onPress={() => actions.logoutUser()}
          align="center"
          margin="10 0 10 0"
        >
          Please enter your 2FA code to proceed
        </CelText>

        {this.renderDots()}

        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Spinner />
          </View>
        ) : (
          <CelButton style={{ marginTop: 10 }} onPress={this.handlePaste}>
            Paste
          </CelButton>
        )}
        <View>
          <ContactSupport copy="Forgot your code? Contact our support at app@celsius.network." />
        </View>
      </View>
    );
  }

  renderPIN() {
    const { loading, hasSixDigitPin } = this.state;
    const style = VerifyProfileStyle();

    return (
      <View style={style.wrapper}>
        <CelText type="H1" align="center">
          Verification required
        </CelText>
        <CelText align="center" margin="10 0 10 0">
          Please enter your PIN to proceed
        </CelText>

        {this.renderDots(hasSixDigitPin ? 6 : 4)}
        <View>
          <ContactSupport copy="Forgot PIN? Contact our support at app@celsius.network." />
        </View>

        {loading && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Spinner />
          </View>
        )}
      </View>
    );
  }

  render() {
    const { value } = this.state;
    const { actions, navigation, appState } = this.props;
    const hideBack = navigation.getParam("hideBack");

    const shouldShow2FA = this.shouldShow2FA();
    const field = shouldShow2FA ? "code" : "pin";
    const onPressFunc = shouldShow2FA
      ? this.handle2FAChange
      : this.handlePINChange;
    const style = VerifyProfileStyle();

    return (
      <RegularLayout
        padding="0 0 0 0"
        fabType={
          hideBack || appState.match(/inactive|background/) ? "hide" : "main"
        }
      >
        <NavigationEvents onDidFocus={() => this.openKeypad()} />
        <View style={style.container}>
          {shouldShow2FA ? this.render2FA() : this.renderPIN()}
          <CelNumpad
            field={field}
            value={value}
            updateFormField={actions.updateFormField}
            setKeypadInput={actions.setKeypadInput}
            toggleKeypad={actions.toggleKeypad}
            onPress={onPressFunc}
            purpose={KEYPAD_PURPOSES.VERIFICATION}
          />
        </View>
      </RegularLayout>
    );
  }
}

export default VerifyProfile;
