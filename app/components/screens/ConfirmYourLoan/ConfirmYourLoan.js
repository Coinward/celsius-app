import React, { Component } from "react";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { countries } from "country-data";

import * as appActions from "../../../redux/actions";
import ConfirmYourLoanStyle from "./ConfirmYourLoan.styles";
import CelText from "../../atoms/CelText/CelText";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import formatter from "../../../utils/formatter";
import CelButton from "../../atoms/CelButton/CelButton";
import Separator from "../../atoms/Separator/Separator";
import Card from "../../atoms/Card/Card";
import STYLES from "../../../constants/STYLES";
import { LOAN_TYPES } from "../../../constants/DATA";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";

// TODO rename to BorrowLoanConfirm
@connect(
  state => ({
    formData: state.forms.formData,
    loan: state.loans.loan,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ConfirmYourLoan extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Confirm Your Loan",
    right: "profile",
    customCenterComponent: { steps: 8, currentStep: 7, flowProgress: true },
  });

  componentDidMount() {
    const { actions } = this.props;
    actions.loanApplyPreviewData();
  }

  showCountry(countryName) {
    const style = ConfirmYourLoanStyle();
    let iso;
    let country;

    Object.keys(countries).forEach(key => {
      if (countries[key].name === countryName) {
        country = countries[key];
        iso = country.alpha2;
      }
    });
    if (iso)
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png250px/${iso.toLowerCase()}.png`,
            }}
            resizeMode="cover"
            style={style.flagImage}
          />
          <CelText type="H3" weight="600" margin={"0 0 15 5"}>
            {country.name}
          </CelText>
        </View>
      );
  }

  renderBankInfo = () => {
    const { formData } = this.props;
    if (formData.loanType === LOAN_TYPES.USD_LOAN) {
      const { loan } = this.props;
      return (
        <Card>
          <CelText type="H6" weight="300">
            Bank Name
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_name}
          </CelText>

          <CelText type="H6" weight="300">
            Bank Address
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_street_and_number}
          </CelText>

          <CelText type="H6" weight="300">
            Account Holder Name
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_account_holder_name}
          </CelText>

          <CelText type="H6" weight="300">
            Bank ZIP / Postal Code
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_zip}
          </CelText>

          <CelText type="H6" weight="300">
            Bank City
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_city}
          </CelText>

          <CelText type="H6" weight="300" margin={"0 0 3 0"}>
            Bank Country
          </CelText>
          {this.showCountry(loan.bank_location)}
          {this.renderBankAccountInfo()}
        </Card>
      );
    }
  };

  renderBankAccountInfo = () => {
    const { bankInfo } = this.props.formData;
    const { loan } = this.props;

    if (bankInfo && bankInfo.location === "United States") {
      return (
        <View>
          <CelText type="H6" weight="300">
            ABA (routing number)
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_routing_number}
          </CelText>

          <CelText type="H6" weight="300">
            Your Account Number
          </CelText>
          <CelText type="H3" weight="600" margin={"0 0 15 0"}>
            {loan.bank_account_number}
          </CelText>
        </View>
      );
    }
    return (
      <View>
        <CelText type="H6" weight="300">
          SWIFT (Bank Identifier Code)
        </CelText>
        <CelText type="H3" weight="600" margin={"0 0 15 0"}>
          {loan.bank_account_swift}
        </CelText>

        <CelText type="H6" weight="300">
          Your Account Number
        </CelText>
        <CelText type="H3" weight="600" margin={"0 0 15 0"}>
          {loan.bank_account_iban}
        </CelText>
      </View>
    );
  };

  renderAmount = () => {
    const { loan } = this.props;

    if (loan.asset !== "USD") {
      return (
        <CelText align="center" type="H1" weight="bold">
          {formatter.crypto(loan.loan_amount, loan.coin_loan_asset, {
            precision: 2,
          })}
        </CelText>
      );
    }
    return (
      <CelText align="center" type="H1" weight="bold">
        {formatter.usd(loan.loan_amount, { precision: 0 })}
      </CelText>
    );
  };

  renderContent = () => {
    const { loan, actions } = this.props;
    const style = ConfirmYourLoanStyle();

    return (
      <View flex={1}>
        <RegularLayout fabType={"hide"}>
          <View>
            <CelText align="center">You are about to borrow</CelText>
            {this.renderAmount()}
            <Card>
              <CelText type="H6" weight="300" align="center">
                Estimated Collateral
              </CelText>
              <CelText type="H3" weight="700" align="center" margin="5 0 10 0">
                {formatter.crypto(loan.amount_collateral_crypto, loan.coin)}
              </CelText>
              <Card color={style.grayCard.color}>
                <CelText type="H6" weight="300">
                  The exact amount of collateral needed will be determined upon
                  approval. Coins used for collateral will be locked and
                  ineligible to earn interest.
                </CelText>
              </Card>
            </Card>

            <Card>
              <View style={style.horizontalCardContainer}>
                <View style={style.horizontalCardItem}>
                  <CelText type="H6" weight="300" align="center">
                    Term Length
                  </CelText>
                  <CelText type="H3" weight="600" align="center">
                    {loan.term_of_loan} months
                  </CelText>
                </View>

                <View style={style.separatorContainer}>
                  <Separator vertical height={"60%"} />
                </View>

                <View style={style.horizontalCardItem}>
                  <CelText type="H6" weight="300" align="center">
                    Annual Interest Rate
                  </CelText>
                  <CelText type="H3" weight="600" align="center">
                    {formatter.percentage(loan.interest)}%
                  </CelText>
                </View>
              </View>
            </Card>

            <Card>
              <View style={style.horizontalCardContainer}>
                <View style={style.horizontalCardItem}>
                  <CelText type="H6" weight="300" align="center">
                    Monthly Interest
                  </CelText>
                  <CelText type="H3" weight="600" align="center">
                    {formatter.usd(loan.monthly_payment)}
                  </CelText>
                </View>

                <View style={style.separatorContainer}>
                  <Separator vertical height={"60%"} />
                </View>

                <View style={style.horizontalCardItem}>
                  <CelText type="H6" weight="300" align="center">
                    Total Interest
                  </CelText>
                  <CelText type="H3" weight="600" align="center">
                    {formatter.usd(loan.total_interest)}
                  </CelText>
                </View>
              </View>
            </Card>

            <Card>
              <CelText type="H6" weight="300" align="center">
                Total of Payments
              </CelText>
              <CelText type="H3" weight="600" align="center">
                {formatter.usd(loan.total_of_payment)}
              </CelText>
              <CelText type="H6" weight="300" align="center">
                (Amount Borrowed + Total Interest)
              </CelText>

              <Separator margin={"10 0 10 0"} />

              <CelText type="H6" weight="300" align="center">
                Number of Payments
              </CelText>
              <CelText type="H3" weight="600" align="center">
                {loan.term_of_loan}
              </CelText>
            </Card>

            <Card color={style.blueCard.color}>
              <CelText
                type="H6"
                weight="300"
                align="center"
                color={style.blueCardText.color}
              >
                Reduce your interest rate by
              </CelText>
              <CelText
                type="H3"
                weight="600"
                align="center"
                color={style.blueCardBoldText.color}
              >
                {formatter.percentage(loan.loan_interest_bonus)} %
              </CelText>
              <CelText
                type="H6"
                weight="300"
                align="center"
                color={style.blueCardText.color}
              >
                By paying out in
                <CelText
                  type="H5"
                  weight="300"
                  align="center"
                  color={style.blueCardBoldText.color}
                >
                  {" "}
                  CEL
                </CelText>
              </CelText>

              <Separator
                margin={"10 0 10 0"}
                color={style.blueCardText.color}
              />

              <View style={style.horizontalCardContainer}>
                <View style={style.horizontalCardItem}>
                  <CelText
                    type="H6"
                    weight="300"
                    align="center"
                    color={style.blueCardText.color}
                  >
                    {" "}
                    Monthly Interest
                  </CelText>
                  <CelText
                    type="H3"
                    weight="600"
                    align="center"
                    color={style.blueCardBoldText.color}
                  >
                    {formatter.crypto(loan.monthly_payment_in_cel, "CEL", {
                      precision: 2,
                    })}
                  </CelText>
                </View>

                <View style={style.separatorContainer}>
                  <Separator vertical height={"60%"} />
                </View>

                <View style={style.horizontalCardItem}>
                  <CelText
                    type="H6"
                    weight="300"
                    align="center"
                    color={style.blueCardText.color}
                  >
                    Total Interest
                  </CelText>
                  <CelText
                    type="H3"
                    weight="600"
                    align="center"
                    color={style.blueCardBoldText.color}
                  >
                    {formatter.crypto(loan.total_interest_in_cel, "CEL", {
                      precision: 2,
                    })}
                  </CelText>
                </View>
              </View>

              <Card noBorder color={STYLES.COLORS.WHITE_OPACITY1}>
                <View style={style.horizontalCardContainer}>
                  <View style={style.horizontalCardItem}>
                    <CelText
                      type="H6"
                      weight="300"
                      align="center"
                      color={style.blueCardText.color}
                    >
                      {" "}
                      Original Monthly Interest
                    </CelText>
                    <CelText
                      type="H3"
                      weight="600"
                      align="center"
                      color={style.blueCardBoldText.color}
                      strikethrough
                    >
                      {formatter.usd(
                        loan.original_monthly_interest_payment_in_usd
                      )}
                    </CelText>
                  </View>

                  <View style={style.separatorContainer}>
                    <Separator
                      vertical
                      height={"60%"}
                      color={style.blueCardText.color}
                    />
                  </View>

                  <View style={style.horizontalCardItem}>
                    <CelText
                      type="H6"
                      weight="300"
                      align="center"
                      color={style.blueCardText.color}
                    >
                      Discounted Monthly Interest
                    </CelText>
                    <CelText
                      type="H3"
                      weight="600"
                      align="center"
                      color={style.blueCardBoldText.color}
                    >
                      {formatter.usd(
                        loan.discounted_monthly_interest_payment_in_usd
                      )}
                    </CelText>
                  </View>
                </View>
              </Card>

              <Card noBorder color={STYLES.COLORS.WHITE_OPACITY1}>
                <View style={style.horizontalCardContainer}>
                  <View style={style.horizontalCardItem}>
                    <CelText
                      type="H6"
                      weight="300"
                      align="center"
                      color={style.blueCardText.color}
                    >
                      {" "}
                      Original Total Interest
                    </CelText>
                    <CelText
                      type="H3"
                      weight="600"
                      align="center"
                      color={style.blueCardBoldText.color}
                      strikethrough
                    >
                      {formatter.usd(loan.original_total_interest_in_usd)}
                    </CelText>
                  </View>

                  <View style={style.separatorContainer}>
                    <Separator
                      vertical
                      height={"60%"}
                      color={style.blueCardText.color}
                    />
                  </View>

                  <View style={style.horizontalCardItem}>
                    <CelText
                      type="H6"
                      weight="300"
                      align="center"
                      color={style.blueCardText.color}
                    >
                      Discounted Total Interest
                    </CelText>
                    <CelText
                      type="H3"
                      weight="600"
                      align="center"
                      color={style.blueCardBoldText.color}
                    >
                      {formatter.usd(loan.discounted_total_interest_in_usd)}
                    </CelText>
                  </View>
                </View>
              </Card>

              <CelText
                type="H6"
                weight="300"
                italic
                align="center"
                margin=" 0 0 5 0"
                color={style.blueCardText.color}
              >
                {" "}
                This rate is subject to change based on your loyalty level and
                CEL price at the time of payment.
              </CelText>
            </Card>

            {this.renderBankInfo()}

            <Card>
              <CelText type="H6" weight="300" align="center">
                {loan.coin}
                <CelText type="H6" weight="300" align="center">
                  {" "}
                  Margin Call at
                </CelText>
              </CelText>
              <CelText type="H3" weight="700" align="center" margin="5 0 10 0">
                {formatter.usd(loan.margin_call_price)}
              </CelText>
              <Card color={style.grayCard.color}>
                <CelText type="H6" weight="300">{`If ${
                  loan.coin
                } drops below ${formatter.usd(
                  loan.margin_call_price
                )}, you will be required to add collateral to meet the minimum LTV.`}</CelText>
              </Card>
            </Card>

            <Card>
              <CelText type="H6" weight="300" align="center">
                Liquidation at
              </CelText>
              <CelText type="H3" weight="700" align="center" margin="5 0 10 0">
                {formatter.usd(loan.liquidation_call_price)}
              </CelText>
              <Card color={style.grayCard.color}>
                <CelText type="H6" weight="300">{`If ${
                  loan.coin
                } drops below ${formatter.usd(
                  loan.liquidation_call_price
                )} and margin call has not been met we will liquidate a portion of your collateral to cover the Margin Call.`}</CelText>
              </Card>
            </Card>

            <CelButton
              onPress={() => actions.navigateTo("LoanTermsOfUse")}
              margin="22 0 0 0"
            >
              Continue
            </CelButton>
          </View>
        </RegularLayout>
      </View>
    );
  };

  render() {
    const { callsInProgress, loan } = this.props;

    const isLoading =
      !loan ||
      apiUtil.areCallsInProgress(
        [API.APPLY_FOR_LOAN_PREVIEW_DATA],
        callsInProgress
      );

    if (isLoading) {
      return <LoadingScreen />;
    }

    return this.renderContent();
  }
}

export default ConfirmYourLoan;
