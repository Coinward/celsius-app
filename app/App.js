import React, { Component } from "react";
import { Provider } from "react-redux";
import SplashScreen from "react-native-splash-screen";
import { AppState, BackHandler, StyleSheet, StatusBar } from "react-native";
import codePush from "react-native-code-push";
import * as Font from "expo-font";

import store from "./redux/store";
import * as actions from "./redux/actions";
import AppNavigation from "./navigator/Navigator";
import Message from "./components/molecules/Message/Message";
import DeepLinkController from "./components/molecules/DeepLinkController/DeepLinkController";
import ErrorBoundary from "./ErrorBoundary";
import { remotePushController } from "./utils/push-notifications-util";
import FabIntersection from "./components/organisms/FabIntersection/FabIntersection";
import apiUtil from "./utils/api-util";
import appUtil from "./utils/app-util";
import branchUtil from "./utils/branch-util";
import { disableAccessibilityFontScaling } from "./utils/styles-util";
import { getSecureStoreKey } from "./utils/expo-storage";
import Constants from "../constants";
import { STORYBOOK } from "../dev-settings";
import StoryBook from "./components/screens/Storybook/Storybook";

const { SECURITY_STORAGE_AUTH_KEY } = Constants;

// eslint-disable-next-line no-console
console.disableYellowBox = true;

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

class App extends Component {
  async componentDidMount() {
    // Hide Splashscreen immediately when in STORYBOOK mode
    if (STORYBOOK) {
      SplashScreen.hide();
      return;
    }

    StatusBar.setHidden(true);

    appUtil.logoutOnEnvChange();
    appUtil.initInternetConnectivityListener();
    apiUtil.initInterceptors();
    store.dispatch(branchUtil.initBranch());

    await appUtil.updateCelsiusApp();

    disableAccessibilityFontScaling();
    store.dispatch(actions.isGoodForAnimations());
    store.dispatch(actions.getGeolocation());

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      store.dispatch(actions.navigateBack());
      return true;
    });

    AppState.addEventListener("change", nextState => {
      store.dispatch(actions.handleAppStateChange(nextState));
    });

    await store.dispatch(await actions.loadCelsiusAssets());
    StyleSheet.setStyleAttributePreprocessor(
      "fontFamily",
      Font.processFontFamily
    );

    appUtil.initializeThirdPartyServices();
    appUtil.pollBackendStatus();

    const token = await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
    if (!token) {
      return store.dispatch(actions.navigateTo("Welcome"));
    }

    await appUtil.checkAndRefreshAuthToken(token);

    await store.dispatch(actions.getInitialCelsiusData());
    store.dispatch(actions.navigateTo("Home"));
  }

  componentWillUnmount() {
    this.backHandler.remove();
    AppState.removeEventListener("change", nextState => {
      store.dispatch(actions.handleAppStateChange(nextState));
    });
  }

  render() {
    // render StoryBook instead of regular app
    if (STORYBOOK) return <StoryBook />;

    return (
      <ErrorBoundary>
        <CelsiusApplication />
      </ErrorBoundary>
    );
  }
}

const CelsiusApplication = () => (
  <Provider store={store}>
    <React.Fragment>
      <AppNavigation
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);

          if (prevScreen !== currentScreen) {
            store.dispatch(actions.setActiveScreen(currentScreen));
          }
        }}
        ref={navigatorRef => actions.setTopLevelNavigator(navigatorRef)}
      />
      <Message />
      <FabIntersection />
    </React.Fragment>
    <DeepLinkController />
    {remotePushController()}
  </Provider>
);

const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

export default codePush(codePushOptions)(App);
