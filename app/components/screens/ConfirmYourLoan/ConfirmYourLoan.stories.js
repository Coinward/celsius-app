import React from "react";
import _ from "lodash";

import ConfirmYourLoan from "./ConfirmYourLoan";
import ScreenStoryWrapper from "../../../../storybook/stories/ScreenStoryWrapper/ScreenStoryWrapper";
import mockUserStore from "../../../../celsius-app-creds/mock-data/mockUserStore";

const initialState = {
  user: {
    profile: mockUserStore.profile.postman13,
    appSettings: mockUserStore.appSettings.postman13,
  },
  loans: {
    loan: {},
  },
  forms: {
    formData: {},
  },
};

const stableCoin = () => {
  const state = _.cloneDeep(initialState);

  return (
    <ScreenStoryWrapper
      screenName="ConfirmYourLoan"
      screen={ConfirmYourLoan}
      state={state}
    />
  );
};

const usdUS = () => {
  const state = _.cloneDeep(initialState);

  return (
    <ScreenStoryWrapper
      screenName="ConfirmYourLoan"
      screen={ConfirmYourLoan}
      state={state}
    />
  );
};

const usdNonUS = () => {
  const state = _.cloneDeep(initialState);

  return (
    <ScreenStoryWrapper
      screenName="ConfirmYourLoan"
      screen={ConfirmYourLoan}
      state={state}
    />
  );
};

export default {
  stableCoin,
  usdUS,
  usdNonUS,
};
