import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import TxInfoSection from "../../atoms/TxInfoSection/TxInfoSection";
import TxBasicSection from "../../atoms/TxBasicSection/TxBasicSection";
import CelButton from "../../atoms/CelButton/CelButton";
import Card from "../../atoms/Card/Card";
import CelText from "../../atoms/CelText/CelText";
import formatter from "../../../utils/formatter";
import { TRANSACTION_TYPES } from "../../../constants/DATA";

class TransactionDetailsInterest extends Component {
  static propTypes = {
    transaction: PropTypes.instanceOf(Object),
    totalInterest: PropTypes.string,
    actions: PropTypes.instanceOf(Object),
  };
  static defaultProps = {};

  render() {
    // const style = TransactionInterestCelPayStyle();
    const { actions, totalInterest, transaction } = this.props;
    const transactionProps = transaction.uiProps;

    return (
      <RegularLayout>
        <View>
          <TxInfoSection
            margin="40 0 20 0"
            transaction={transaction}
            transactionProps={transactionProps}
          />

          <TxBasicSection
            label={"Date"}
            value={moment(transaction.time).format("D MMM YYYY")}
          />

          <TxBasicSection
            label={"Time"}
            value={moment.utc(transaction.time).format("h:mm A (z)")}
          />

          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            <Card>
              <CelText
                weight="light"
                type="H6"
                align="center"
                style={{ marginBottom: 2 }}
              >
                So far you earned
              </CelText>
              <CelText type="H3" weight="600" align="center">
                {formatter.usd(totalInterest)}
              </CelText>
            </Card>
          </View>

          {transaction.type === TRANSACTION_TYPES.PENDING_INTEREST ? (
            <Card>
              <CelText align={"left"} type={"H4"}>
                Want to earn better interest rates?
              </CelText>
              <CelText
                margin={"20 0 0 0"}
                align={"left"}
                type={"H4"}
                weight={"600"}
              >
                Earn interest in CEL! Simply go to your settings and change the
                way you receive interest.
              </CelText>
              <CelButton
                margin={"20 0 0 0"}
                basic
                onPress={() => actions.navigateTo("WalletSettings")}
              >
                Change Settings
              </CelButton>
            </Card>
          ) : null}

          <CelButton
            margin={"40 0 0 0"}
            onPress={() => actions.navigateTo("Deposit")}
          >
            Deposit coins
          </CelButton>
          <CelButton
            margin={"20 0 0 0"}
            basic
            onPress={() => actions.navigateTo("WalletLanding")}
          >
            Go Back to Wallet
          </CelButton>
        </View>
      </RegularLayout>
    );
  }
}

export default TransactionDetailsInterest;
