import { Platform } from "react-native";
import store from "../redux/store";
import { hasPassedKYC } from "./user-util";

export { isLoanBannerVisible, isIos };

function isIos() {
  return Platform.OS === "ios";
}

function isLoanBannerVisible() {
  const { isBannerVisible } = store.getState().ui;
  const { allLoans } = store.getState().loans;
  const user = store.getState().user.profile;
  const { loan } = store.getState().compliance;

  const hasLoans = !!allLoans.length;

  return !!(
    hasPassedKYC() &&
    loan.allowed &&
    user.celsius_member &&
    !hasLoans &&
    isBannerVisible
  );
}
