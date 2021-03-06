import React, { Component } from "react";
import {
  Image,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import CelHeadingStyle from "./CelHeading.styles";
import { getPadding, getTheme } from "../../../utils/styles-util";
import CelButton from "../../atoms/CelButton/CelButton";
import { THEMES } from "../../../constants/UI";
import CelInput from "../../atoms/CelInput/CelInput";
import CelText from "../../atoms/CelText/CelText";
import STYLES from "../../../constants/STYLES";
import HodlBanner from "../../atoms/HodlBanner/HodlBanner";
import Icon from "../../atoms/Icon/Icon";
import Loader from "../../atoms/Loader/Loader";
import fromatter from "../../../utils/formatter";

@connect(
  state => ({
    profilePicture: state.user.profile.profile_picture,
    message: state.ui.message,
    formData: state.forms.formData,
    theme: state.user.appSettings.theme,
    hodlStatus: state.hodl.hodlStatus,
    activeScreen: state.nav.activeScreen,
    internetConnected: state.app.internetConnected,
    walletSummary: state.wallet.summary,
    changeWalletHeader: state.animations.changeWalletHeader,
    changeCoinDetailsHeader: state.animations.changeCoinDetailsHeader,
    changeInterestHeader: state.animations.changeInterestHeader,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class CelHeading extends Component {
  /**
   * List of possible scene props (props that comes through navigationOptions)
   *
   * @type {boolean}
   * hideBack
   *
   * @type {string}
   * right: oneOf(['action', 'signup', 'login', 'info', 'search', 'profile', 'logout', 'close'])
   *
   * @type {function}
   * onInfo
   *
   * @type {boolean}
   * transparent
   *
   * @description if headerSameColor=true it will set header background color same as content background
   * @type {boolean}
   * headerSameColor
   *
   * @type {React.Component}
   * customCenterComponent
   */

  constructor(props) {
    super(props);
    this.state = {
      screen: props.scene.route.routeName,
    };
  }

  componentDidMount() {
    this.getStatusBarTextColor();
  }

  componentDidUpdate(prevProps) {
    const { theme } = this.props;
    if (prevProps.theme !== theme) {
      this.getStatusBarTextColor();
    }
  }

  isSearchHeader = () => {
    return this.props.scene.descriptor.options.right === "search";
  };

  navigateBack = (customBack, backScreenName) => {
    const { actions } = this.props;
    if (customBack) {
      customBack();
    } else {
      actions.navigateBack(backScreenName);
    }
  };

  getLeftContent = sceneProps => {
    const { hideBack, customBack } = sceneProps;
    const { scenes } = this.props;

    const backScreenName = scenes[this.props.index - 1]
      ? scenes[this.props.index - 1].route.routeName
      : "";

    // By default if scene prop hideBack is true or it's first screen in the stack, hide back arrow
    return this.props.scene.index === 0 || hideBack === true ? null : (
      <CelButton
        margin={this.isSearchHeader() ? "8 0 0 4" : null}
        iconRightColor={STYLES.COLORS.GRAY}
        basic
        onPress={() => this.navigateBack(customBack, backScreenName)}
        iconRight="IconChevronLeft"
      />
    );
  };

  getRightContent = sceneProps => {
    const { right, onInfo } = sceneProps;
    const { profilePicture, actions } = this.props;
    const scene = this.props.scene.descriptor;

    const style = CelHeadingStyle();
    const theme = getTheme();

    return {
      action: (
        <CelButton basic onPress={() => {}}>
          Action
        </CelButton>
      ),
      signup: (
        <CelButton
          basic
          onPress={() => {
            this.props.actions.navigateTo("RegisterInitial");
          }}
        >
          Sign up
        </CelButton>
      ),
      login: (
        <CelButton
          basic
          onPress={() => {
            this.props.actions.navigateTo("Login");
          }}
        >
          Log in
        </CelButton>
      ),
      info: onInfo && (
        <TouchableOpacity basic onPress={onInfo}>
          <Icon
            name={"Info"}
            height={30}
            width={30}
            fill={
              theme === THEMES.LIGHT
                ? STYLES.COLORS.DARK_GRAY3
                : STYLES.COLORS.WHITE_OPACITY5
            }
          />
        </TouchableOpacity>
      ),
      search: (
        <Icon
          name={"Search"}
          height={30}
          width={30}
          fill={
            theme === THEMES.LIGHT
              ? STYLES.COLORS.DARK_GRAY3
              : STYLES.COLORS.WHITE_OPACITY5
          }
        />
      ),
      profile: (
        <TouchableOpacity
          onPress={() => {
            this.props.actions.navigateTo("Profile");
          }}
        >
          {profilePicture ? (
            <Image
              style={style.profilePicture}
              source={{
                uri: profilePicture,
                cache: "default",
              }}
              resizeMethod="resize"
              resizeMode="cover"
            />
          ) : (
            <Image
              style={style.profilePicture}
              source={require("../../../../assets/images/empty-profile/empty-profile.png")}
              resizeMethod="resize"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      ),
      logout: (
        <CelButton basic onPress={() => this.props.actions.logoutUser()}>
          Logout
        </CelButton>
      ),
      close: (
        <CelButton
          basic
          onPress={() => {
            this.props.actions.navigateBack();
          }}
        >
          Close
        </CelButton>
      ), // TODO(sb):
      cancel: scene.state.routeName !== "VerifyProfile" && (
        <CelButton
          basic
          onPress={() => {
            actions.updateFormField("search", "");
          }}
        >
          Cancel
        </CelButton>
      ),
    }[right];
  };

  getStatusBarTextColor = () => {
    const { message, theme } = this.props;
    if (message && message.text) {
      return StatusBar.setBarStyle("light-content");
    }
    switch (theme) {
      case THEMES.LIGHT:
        return StatusBar.setBarStyle("dark-content");
      case THEMES.DARK:
        return StatusBar.setBarStyle("light-content");
      case THEMES.CELSIUS:
        return StatusBar.setBarStyle("light-content");
      default:
        return StatusBar.setBarStyle("light-content");
    }
  };

  getTitle = () => {
    const sceneOptions = this.props.scene.descriptor.options;
    const { title } = sceneOptions;
    const {
      walletSummary,
      activeScreen,
      changeWalletHeader,
      changeInterestHeader,
    } = this.props;
    let screenTitle;

    if (
      (activeScreen === "WalletLanding" || activeScreen === "BalanceHistory") &&
      changeWalletHeader
    ) {
      screenTitle = walletSummary
        ? fromatter.usd(walletSummary.total_amount_usd)
        : title;
      return screenTitle;
    }

    if (activeScreen === "WalletInterest" && changeInterestHeader) {
      screenTitle = walletSummary
        ? fromatter.usd(walletSummary.total_interest_earned)
        : title;
      return screenTitle;
    }

    // if (activeScreen === "CoinDetails" && changeCoinDetailsHeader ) {
    //   screenTitle = fromatter.usd(walletSummary.total_interest_earned);
    //   return screenTitle
    // }

    return title;
  };

  getCenterContent = sceneProps => {
    const { customCenterComponent } = sceneProps;
    const style = CelHeadingStyle();

    const title = this.getTitle();

    return (
      <View style={style.center}>
        {customCenterComponent && !customCenterComponent.flowProgress ? (
          <View style={style.customCenterComponent}>
            <Loader
              barColor={STYLES.COLORS.GREEN}
              backgroundColor={STYLES.COLORS.GREEN_OPACITY}
              progress={
                customCenterComponent.currentStep / customCenterComponent.steps
              }
              borderColor={STYLES.COLORS.LIGHT_GRAY}
              width={40}
            />
          </View>
        ) : (
          <View>
            <CelText align="center" weight="medium" type="H3">
              {title || ""}
            </CelText>
          </View>
        )}
      </View>
    );
  };

  getSearchPlaceholder = () => {
    const { activeScreen } = this.props;

    let text = "Search";
    if (activeScreen === "SelectCoin") text = "Search assets";
    if (activeScreen === "SelectCountry") text = "Search countries";
    if (activeScreen === "SelectState") text = "Search US States";

    return text;
  };

  getContent = () => {
    const { formData, hodlStatus, actions, activeScreen } = this.props;
    const sceneOptions = this.props.scene.descriptor.options;
    const style = CelHeadingStyle();
    const paddings = getPadding("0 15 0 15");
    const leftStyle = this.isSearchHeader()
      ? [style.left, { flexDirection: "row", flex: 2 }]
      : style.left;

    return (
      <View style={[style.container, paddings]}>
        <HodlBanner
          status={hodlStatus}
          actions={actions}
          activeScreen={activeScreen}
        />
        <View style={[style.content]}>
          <View style={leftStyle}>
            {this.getLeftContent(sceneOptions)}
            {this.isSearchHeader() && (
              <View
                style={[
                  {
                    width: "90%",
                    justifyContent: "center",
                    paddingTop: 5,
                    alignSelf: "center",
                    marginLeft: 12,
                  },
                ]}
              >
                <CelInput
                  debounce
                  autoFocus
                  basic
                  margin="0 0 0 0"
                  field="search"
                  placeholder={this.getSearchPlaceholder()}
                  type="text"
                  value={formData.search}
                />
              </View>
            )}
          </View>
          {!this.isSearchHeader() && this.getCenterContent(sceneOptions)}
          <View style={style.right}>{this.getRightContent(sceneOptions)}</View>
        </View>
        {sceneOptions.customCenterComponent &&
        sceneOptions.customCenterComponent.flowProgress ? (
          <Loader
            flowProgress={sceneOptions.customCenterComponent.flowProgress}
            barColor={STYLES.COLORS.GREEN}
            backgroundColor={STYLES.COLORS.GREEN_OPACITY}
            progress={
              sceneOptions.customCenterComponent.currentStep /
              sceneOptions.customCenterComponent.steps
            }
            borderColor={STYLES.COLORS.LIGHT_GRAY}
            width={100}
          />
        ) : null}
      </View>
    );
  };

  render() {
    let containerStyle;
    const { internetConnected, scene } = this.props;
    const sceneOptions = scene.descriptor.options;
    const { hideHeading, transparent, headerSameColor } = sceneOptions;
    if (hideHeading || !internetConnected) return null;

    const style = CelHeadingStyle();

    if (headerSameColor) {
      containerStyle = style.sameBackground;
    } else if (transparent) {
      containerStyle = style.transparentBackground;
    } else {
      containerStyle = style.headingBackground;
    }

    const Content = this.getContent;

    return (
      <SafeAreaView style={containerStyle}>
        <StatusBar />
        <Content />
      </SafeAreaView>
    );
  }
}

export default CelHeading;
