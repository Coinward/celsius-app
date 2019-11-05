import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import * as appActions from "../../../redux/actions";
import BorrowCalculatorScreenStyle from "./BorrowCalculatorScreen.styles";
import CelText from "../../atoms/CelText/CelText";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import formatter from "../../../utils/formatter";
import Separator from "../../atoms/Separator/Separator";
import STYLES from "../../../constants/STYLES";
import CelButton from "../../atoms/CelButton/CelButton";
import BorrowCalculator from "../BorrowCalculator/BorrowCalculator";
import { KYC_STATUSES } from "../../../constants/DATA";
import { EMPTY_STATES } from "../../../constants/UI";

@connect(
  state => ({
    ltv: state.loans.ltvs,
    theme: state.user.appSettings.theme,
    formData: state.forms.formData,
    currencies: state.currencies.rates,
    loanCompliance: state.compliance.loan,
    minimumLoanAmount: state.generalData.minimumLoanAmount,
    walletSummary: state.wallet.summary,
    kycStatus: state.user.profile.kyc
      ? state.user.profile.kyc.status
      : KYC_STATUSES.collecting,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class BorrowCalculatorScreen extends Component {
  static propTypes = {
    purpose: PropTypes.string,
  };
  constructor(props) {
    super(props);

    const { currencies, loanCompliance, ltv, minimumLoanAmount } = props;

    const coinSelectItems = currencies
      .filter(c => loanCompliance.collateral_coins.includes(c.short))
      .map(c => ({
        label: `${c.displayName} - ${c.short}`,
        value: c.short,
      }));

    this.state = {
      coinSelectItems,
      loanParams: {},
    };

    this.sliderItems = [
      { value: 6, label: <CelText>6M</CelText> },
      { value: 12, label: <CelText>1Y</CelText> },
      { value: 24, label: <CelText>2Y</CelText> },
      { value: 48, label: <CelText>4Y</CelText> },
    ];

    props.actions.initForm({
      coin: "BTC",
      termOfLoan: 6,
      amount: minimumLoanAmount,
      ltv: ltv[0],
    });

    this.style = BorrowCalculatorScreenStyle();
  }

  componentDidUpdate(prevProps) {
    const { formData } = this.props;

    if (!_.isEqual(formData, prevProps.formData)) {
      this.sliderItems = [
        {
          value: 6,
          label: (
            <CelText
              weight={formData.termOfLoan === 6 ? "bold" : "300"}
              color={
                formData.termOfLoan === 6 ? STYLES.COLORS.CELSIUS_BLUE : null
              }
            >
              6M
            </CelText>
          ),
        },
        {
          value: 12,
          label: (
            <CelText
              weight={formData.termOfLoan === 12 ? "bold" : "300"}
              color={
                formData.termOfLoan === 12 ? STYLES.COLORS.CELSIUS_BLUE : null
              }
            >
              1Y
            </CelText>
          ),
        },
        {
          value: 24,
          label: (
            <CelText
              weight={formData.termOfLoan === 24 ? "bold" : "300"}
              color={
                formData.termOfLoan === 24 ? STYLES.COLORS.CELSIUS_BLUE : null
              }
            >
              2Y
            </CelText>
          ),
        },
        {
          value: 48,
          label: (
            <CelText
              weight={formData.termOfLoan === 48 ? "bold" : "300"}
              color={
                formData.termOfLoan === 48 ? STYLES.COLORS.CELSIUS_BLUE : null
              }
            >
              4Y
            </CelText>
          ),
        },
      ];
    }
  }

  getPurposeSpecificProps = () => {
    const { purpose, actions, emitParams } = this.props;
    const loanParams = emitParams();

    const defaultProps = {
      subtitle: "Calculate your loan interest.",
      bottomHeading: "Borrow dollars for your crypto",
      bottomParagraph: "Calculate your loan interest before you deposit coins",
      buttonCopy: "Deposit",
      onPress: () => actions.navigateTo("Deposit", { coin: "CEL" }),
    };

    switch (purpose) {
      case EMPTY_STATES.NON_VERIFIED_BORROW:
        return {
          ...defaultProps,
          subtitle: "Calculate your interest before you verify your ID",
          bottomHeading: "Borrow dollars for Crypto",
          bottomParagraph: loanParams
            ? `Verify your identity to start using your coins as collateral and get a dollar loan starting at just ${formatter.percentageDisplay(
                loanParams.bestLtv
              )} APR`
            : null,
          buttonCopy: "Verify identity",
          onPress: () => actions.navigateTo("KYCProfileDetails"),
        };

      case EMPTY_STATES.BORROW_NOT_ENOUGH_FUNDS:
        return {
          ...defaultProps,
          subtitle: "",
          bottomHeading: loanParams
            ? `To apply for a loan, you need to deposit an additional ${formatter.crypto(
                loanParams.missingCollateral,
                loanParams.largestShortCrypto
              )}`
            : null,
          bottomParagraph:
            "Deposit more coins to start your first loan application",
          buttonCopy: "Deposit coins",
          onPress: () =>
            actions.navigateTo("Deposit", {
              coin: loanParams ? loanParams.largestShortCrypto : null,
            }),
        };

      case EMPTY_STATES.NON_MEMBER_BORROW:
        return {
          ...defaultProps,
          subtitle: "",
          bottomHeading: "Borrow dollars for your crypto",
          bottomParagraph:
            "Calculate your loan interest before you deposit coins",
          buttonCopy: "Deposit CEL",
        };

      case EMPTY_STATES.COMPLIANCE:
        return {
          ...defaultProps,
          subtitle:
            "You are not allowed to apply for a loan because of local laws and regulations",
          bottomHeading: null,
          bottomParagraph: null,
          buttonCopy: "Go to Wallet",
          onPress: () => actions.navigateTo("WalletLanding"),
        };

      case EMPTY_STATES.NO_LOANS:
        return {
          ...defaultProps,
          subtitle: "",
          bottomHeading: null,
          bottomParagraph: null,
          buttonCopy: "Create a loan",
          onPress: () => actions.navigateTo("BorrowEnterAmount"),
        };

      default:
        return defaultProps;
    }
  };

  changeAmount = (field, value) => {
    const { actions, minimumLoanAmount } = this.props;

    if (Number(value) < minimumLoanAmount) {
      actions.showMessage(
        "warning",
        `Minimum amount for a loan is ${formatter.usd(minimumLoanAmount)}`
      );
    }

    actions.updateFormField(field, value);
  };

  render() {
    const style = BorrowCalculatorScreenStyle();
    const { formData, purpose, emitParams, kycStatus } = this.props;
    const purposeProps = this.getPurposeSpecificProps();

    if (!formData.ltv) return null;

    return (
      <RegularLayout style={style.container}>
        <CelText weight="bold" type="H2" align="center">
          Loan Calculator
        </CelText>
        <CelText
          align={"center"}
          type={"H4"}
          margin={"4 0 20 0"}
          weight={"300"}
        >
          {purposeProps.subtitle}
        </CelText>
        <Separator />
        <BorrowCalculator emitParams={emitParams} purpose={purpose} />
        <Separator />
        <View>
          {!!purposeProps.bottomHeading && (
            <CelText
              weight="bold"
              type="H2"
              align="center"
              margin={"20 0 20 0"}
            >
              {purposeProps.bottomHeading}
            </CelText>
          )}
          {!!purposeProps.bottomParagraph && (
            <CelText
              align={"center"}
              type={"H4"}
              margin={"4 0 20 0"}
              weight={"300"}
            >
              {purposeProps.bottomParagraph}
            </CelText>
          )}

          {![
            KYC_STATUSES.pending,
            KYC_STATUSES.sending,
            KYC_STATUSES.sent,
          ].includes(kycStatus) && (
            <CelButton onPress={purposeProps.onPress} margin="20 0 20 0">
              {purposeProps.buttonCopy}
            </CelButton>
          )}
        </View>
      </RegularLayout>
    );
  }
}

export default BorrowCalculatorScreen;
