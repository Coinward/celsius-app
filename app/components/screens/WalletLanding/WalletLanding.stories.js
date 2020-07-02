import React from "react";

import WalletLanding from "./WalletLanding";
import ScreenStoryWrapper from "../../../../storybook/stories/ScreenStoryWrapper/ScreenStoryWrapper";
import mockCurrenciesStore from "../../../../celsius-app-creds/mock-data/mockCurrenciesStore";
import mockComplianceStore from "../../../../celsius-app-creds/mock-data/mockComplianceStore";
import mockWalletStore from "../../../../celsius-app-creds/mock-data/mockWalletStore";
import mockUserStore from "../../../../celsius-app-creds/mock-data/mockUserStore";
import mockLoyaltyStore from "../../../../celsius-app-creds/mock-data/mockLoyaltyStore";
import mockGeneralDataStore from "../../../../celsius-app-creds/mock-data/mockGeneralDataStore";
import walletUtil from "../../../utils/wallet-util";
import mockUIStore from "../../../../celsius-app-creds/mock-data/mockUIStore";

const initialState = {
  wallet: {
    summary: walletUtil.mapWalletSummary(mockWalletStore.summary.postman13),
  },
  currencies: {
    rates: mockCurrenciesStore.rates,
    graphs: mockCurrenciesStore.graphs,
    currencyRatesShort: mockCurrenciesStore.currencyRatesShort,
  },
  compliance: mockComplianceStore.allowedAll,
  user: {
    profile: mockUserStore.profile.postman13,
    appSettings: mockUserStore.appSettings.postman13,
  },
  ui: mockUIStore.noBannerNoAnimations,
  loyalty: mockLoyaltyStore.loyalty.postman13,
  generalData: mockGeneralDataStore,
};

const grid = () => {
  return (
    <ScreenStoryWrapper
      screenName="WalletLanding"
      screen={WalletLanding}
      state={initialState}
    />
  );
};

const list = () => {
  const state = {
    ...initialState,
    user: {
      ...initialState.user,
      appSettings: {
        ...initialState.user.appSettings,
        default_wallet_view: "list",
      },
    },
  };

  return (
    <ScreenStoryWrapper
      screenName="WalletLanding"
      screen={WalletLanding}
      state={state}
    />
  );
};

export default {
  grid,
  list,
};
