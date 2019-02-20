import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/get";

import * as appActions from "../../../redux/actions";
// import {STYLES} from "../../config/constants/style";
import WalletLayoutStyle from "./WalletLayout.styles";
import BasicLayout from "../BasicLayout/BasicLayout";
import { MainHeader } from "../../molecules/MainHeader/MainHeader";
import TabNavigation from "../../molecules/TabNavigation/TabNavigation";
import formatter from "../../../utils/formatter";
import CelScreenContent from "../../atoms/CelScreenContent/CelScreenContent";
import testUtil from "../../../utils/test-util";


@connect(
  state => ({
    walletTotal: state.wallet.total,
    activeScreen: state.nav.routes[state.nav.index].routeName,
    appSettings: state.users.appSettings
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class WalletLayout extends Component {
  // lifecycle methods
  componentDidMount() {
    this.props.actions.getWalletDetails();
  }

  componentWillReceiveProps(nextProps) {
    const { activeScreen, actions } = this.props;

    if (activeScreen !== nextProps.activeScreen &&
      ["WalletBalance", "WalletTransactions", "WalletInterest", "Home"].indexOf(nextProps.activeScreen) !== -1) {
      actions.getWalletDetails();
    }
  }

  tabs = [
    { label: "Balance", screen: "WalletBalance" },
    { label: "Transactions", screen: "WalletTransactions" },
    { label: "Interest", screen: "WalletInterest" }
  ];

  // rendering methods
  render() {
    const { walletTotal } = this.props;
    const total = get(walletTotal, "quotes.USD.total", 0);
    const visibilityStyle = walletTotal ? { opacity: 1 } : { opacity: 0 };

    return (
      <BasicLayout>
        <MainHeader backButton={false} />
        <View
          ref={testUtil.generateTestHook(this, `WalletLayout.home`)}
          style={WalletLayoutStyle.heading}
        >
          <Text style={[WalletLayoutStyle.amountText, visibilityStyle]}>{formatter.usd(total)}</Text>
          <Text style={[WalletLayoutStyle.subheadingText, visibilityStyle]}>WALLET BALANCE</Text>
        </View>

        <TabNavigation tabs={this.tabs} isLoaded={!!walletTotal} />

        <CelScreenContent>
          {this.props.children}
        </CelScreenContent>

      </BasicLayout>
    );
  }
}

export default testUtil.hookComponent(WalletLayout);