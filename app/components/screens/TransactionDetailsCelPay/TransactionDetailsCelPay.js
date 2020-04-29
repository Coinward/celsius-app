import React, { Component } from "react";
import { Share, View } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

import TransactionDetailsCelPayStyle from "./TransactionDetailsCelPay.styles";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import TxInfoSection from "../../atoms/TxInfoSection/TxInfoSection";
import TxBasicSection from "../../atoms/TxBasicSection/TxBasicSection";
import CelButton from "../../atoms/CelButton/CelButton";
import STYLES from "../../../constants/STYLES";
import CelText from "../../atoms/CelText/CelText";
import Separator from "../../atoms/Separator/Separator";
import { TRANSACTION_TYPES } from "../../../constants/DATA";
import TxSentSection from "../../molecules/TxSentSection/TxSentSection";
import formatter from "../../../utils/formatter";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";
import InfoBox from "../../atoms/InfoBox/InfoBox";
import Icon from "../../atoms/Icon/Icon";

class TransactionDetailsCelPay extends Component {
  static propTypes = {
    transaction: PropTypes.instanceOf(Object),
    navigateTo: PropTypes.func,
    cancelingCelPay: PropTypes.bool,
    getTransactionDetails: PropTypes.func,
  };
  static defaultProps = {};

  shareCelPayLink = () => {
    const { transaction } = this.props;

    const branchLink = transaction.transfer_data.branch_link;
    const shareMsg = `You got ${formatter.crypto(
      Math.abs(transaction.amount),
      transaction.coin
    )}! Click on the link to claim it ${branchLink}`;
    Share.share({ message: shareMsg, title: "Celsius CelPay" });
    mixpanelAnalytics.sharedCelPayLink();
  };

  render() {
    const {
      transaction,
      navigateTo,
      cancelTransfer,
      cancelingCelPay,
    } = this.props;
    const transactionProps = transaction.uiProps;
    const style = TransactionDetailsCelPayStyle();
    const type = transaction.type;

    const text = [
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_RETURNED,
    ].includes(type)
      ? "Received from:"
      : "Sent to:";
    const shouldRenderSentSection = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_SENT,
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);
    const shouldRenderCelPayButton = [
      TRANSACTION_TYPES.CELPAY_CANCELED,
      TRANSACTION_TYPES.CELPAY_SENT,
    ].includes(type);
    const shouldRenderShareLink = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_PENDING,
    ].includes(type);
    const shouldRenderGoBackToWallet = [
      TRANSACTION_TYPES.CELPAY_SENT,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);
    const shouldRenderCancel = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_PENDING,
    ].includes(type);
    const shouldRenderNote = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_CLAIMED,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);
    const shouldRenderInfoBox =
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION === type;

    return (
      <RegularLayout>
        <View>
          <TxInfoSection
            margin="40 0 20 0"
            transaction={transaction}
            transactionProps={transactionProps}
          />

          {shouldRenderSentSection ? (
            <TxSentSection text={text} transaction={transaction} />
          ) : null}

          {shouldRenderInfoBox && (
            <InfoBox
              backgroundColor={STYLES.COLORS.ORANGE}
              padding={"20 30 20 10"}
            >
              <View style={style.direction}>
                <View style={style.circle}>
                  <Icon
                    name={"Mail"}
                    height="20"
                    width="20"
                    fill={STYLES.COLORS.ORANGE}
                  />
                </View>
                <CelText color={"white"} margin={"0 20 0 10"}>
                  After you confirm the transaction via email you will be able
                  to share your CelPay link.
                </CelText>
              </View>
            </InfoBox>
          )}

          <TxBasicSection
            label={"Date"}
            value={moment(transaction.time).format("D MMM YYYY")}
          />

          <TxBasicSection
            label={"Time"}
            value={moment.utc(transaction.time).format("h:mm A (z)")}
          />

          {shouldRenderNote && transaction.transfer_data.message ? (
            <View
              style={{
                width: "100%",
                paddingVertical: 20,
              }}
            >
              <CelText type="H6">Note:</CelText>
              <CelText type="H6" italic margin="5 0 0 0">
                {transaction.transfer_data.message}
              </CelText>
              <Separator margin={"20 0 0 0"} />
            </View>
          ) : null}

          {shouldRenderCelPayButton ? (
            <CelButton
              margin={"40 0 0 0"}
              onPress={() => navigateTo("CelPayLanding")}
            >
              Start Another CelPay
            </CelButton>
          ) : null}

          {shouldRenderShareLink && !transaction.transfer_data.claimer ? (
            <CelButton
              margin={"40 0 0 0"}
              onPress={this.shareCelPayLink}
              disabled={type === TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION}
            >
              Share CelPay Link
            </CelButton>
          ) : null}

          {type === TRANSACTION_TYPES.CELPAY_RECEIVED ? (
            <CelButton
              margin={"40 0 0 0"}
              onPress={() => navigateTo("Deposit")}
            >
              Deposit Coins
            </CelButton>
          ) : null}

          {shouldRenderGoBackToWallet ? (
            <CelButton
              margin={"20 0 0 0"}
              basic
              onPress={() => navigateTo("WalletLanding")}
            >
              Go Back to Wallet
            </CelButton>
          ) : null}

          {shouldRenderCancel ? (
            <CelButton
              margin={"20 0 0 0"}
              loading={cancelingCelPay}
              textColor={STYLES.COLORS.RED}
              basic
              onPress={async () => {
                await cancelTransfer(transaction);
                navigateTo("CelPayLanding");
              }}
            >
              Cancel CelPay
            </CelButton>
          ) : null}
        </View>
      </RegularLayout>
    );
  }
}

export default TransactionDetailsCelPay;
