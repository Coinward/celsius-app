import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

import Home from "../components/screens/Home/Home";
import Deposit from "../components/screens/Deposit/Deposit";
import Settings from "../components/screens/Settings/Settings";
import Support from "../components/screens/Support/Support";
import Community from "../components/screens/Community/Community";
import Profile from "../components/screens/Profile/Profile";
import Login from "../components/screens/Login/Login";
import Register from "../components/screens/Register/Register";
import EnterPhone from "../components/screens/EnterPhone/EnterPhone";
import VerifyPhone from "../components/screens/VerifyPhone/VerifyPhone";
import CreatePin from "../components/screens/CreatePin/CreatePin";
import RepeatPin from "../components/screens/RepeatPin/RepeatPin";
import SelectCountry from "../components/screens/SelectCountry/SelectCountry";
import WithdrawConfirm from "../components/screens/WithdrawConfirm/WithdrawConfirm";
import VerifyProfile from "../components/screens/VerifyProfile/VerifyProfile";

import { INITIAL_ROUTE } from "../constants/UI";
import { borrowNavigator } from './flows/borrowFlow'
import { defaultNavigationOptions, transitionConfig } from './navigationConfig'
import { celPayNavigator } from './flows/celPayFlow'
import { walletNavigator } from './flows/walletFlow'

const settingsScreens = {
  Settings,
  Profile,
  VerifyProfile,
}
const settingsProps = {
  headerMode: "none",
  initialRouteName: 'Settings'
}
const SettingsNavigator = createStackNavigator(settingsScreens, settingsProps);

const authScreens = {
  // Auth,
  Login,
  Register,
  EnterPhone,
  VerifyPhone,
  CreatePin,
  RepeatPin
}
const authProps = {
  headerMode: "none",
  initialRouteName: 'Login'
}
const authNavigator = createStackNavigator(authScreens, authProps);

const depositNavigator = createStackNavigator({Deposit}, {
  transitionConfig,
  defaultNavigationOptions
})

export const screens = {
  Home,
  Wallet: walletNavigator,
  CelPayFab: celPayNavigator,
  Settings: SettingsNavigator,
  Auth: authNavigator,
  Borrow: borrowNavigator,
  DepositFab: depositNavigator,
  SelectCountry,
  Support,
  Community,
  WithdrawConfirm,
};

const navigatorProps = {
  initialRouteName: INITIAL_ROUTE,
  transitionConfig,
  defaultNavigationOptions
};

const AppNavigator = createSwitchNavigator(screens, navigatorProps);

export default createAppContainer(AppNavigator);