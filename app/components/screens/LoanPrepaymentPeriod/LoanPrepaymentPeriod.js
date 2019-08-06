import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import LoanPrepaymentPeriodStyle from "./LoanPrepaymentPeriod.styles";
import CelText from "../../atoms/CelText/CelText";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import VerticalSlider from "../../atoms/VerticalSlider/VerticalSlider";
import CelButton from "../../atoms/CelButton/CelButton";
import STYLES from "../../../constants/STYLES";
import formatter from "../../../utils/formatter";

@connect(
  state => ({
    formData: state.forms.formData,
    currenciesRates: state.currencies.rates
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class LoanPrepaymentPeriod extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Prepayment period",
    right: "profile",
    left: "back"
  });

  constructor(props) {
    super(props);

    props.actions.updateFormField("prepaidPeriod", 6);
  }

  calculatePrepaidValue = (usdValue, currenciesRateForCoin, inheritCoin) => {
    const { navigation } = this.props;
    const type = navigation.getParam("type");
    if (type && type === "dollar") {
      return formatter.usd(usdValue);
    }

    return formatter.crypto(usdValue / currenciesRateForCoin, inheritCoin);
  };

  render() {
    const style = LoanPrepaymentPeriodStyle();
    const { actions, formData, navigation, currenciesRates } = this.props;
    const type = navigation.getParam("type");
    const inheritCoin = navigation.getParam("coin");
    let currenciesRateForCoin = currenciesRates.find(
      currenciesRate => currenciesRate.short === inheritCoin
    );
    if ((!type || (type && type !== "dollar")) && currenciesRateForCoin) {
      currenciesRateForCoin = currenciesRateForCoin.market_quotes_usd.price;
    }

    // TODO store prepaidPeriod to formData, consider to move sliderItems to atom
    const sliderItems = [
      {
        value: 6,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 6 ? STYLES.COLORS.CELSIUS_BLUE : null
              }
            >
              6 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 6),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 7,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 12
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              7 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 7),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 8,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 18
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              8 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 8),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 9,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 24
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              9 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 9),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 10,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 30
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              10 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 10),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 11,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 36
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              11 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 11),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      },
      {
        value: 12,
        label: (
          <>
            <CelText
              type="H6"
              weight="bold"
              color={
                formData.prepaidPeriod === 36
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : null
              }
            >
              12 MONTHS
            </CelText>
            <CelText type="H6">
              Prepay:{" "}
              {this.calculatePrepaidValue(
                Number(formData.monthlyPayment * 12),
                currenciesRateForCoin,
                inheritCoin
              )}
            </CelText>
          </>
        )
      }
    ];

    return (
      <View style={style.container}>
        <RegularLayout fabType={"hide"}>
          <View style={{ paddingTop: 10, alignItems: "center" }}>
            <CelText align="center" weight={"300"}>
              Choose your prepayment time period.
            </CelText>
            <CelText margin={"0 0 30 0"} align="center" weight={"300"}>
              Minimum period is 6 months.
            </CelText>
          </View>
          <View>
            <VerticalSlider
              items={sliderItems}
              field="prepaidPeriod"
              value={formData.prepaidPeriod}
              updateFormField={actions.updateFormField}
            />
          </View>

          <CelButton
            margin="50 0 30 0"
            iconRight="IconArrowRight"
            onPress={() => {
              if (type === "dollar") {
                actions.navigateTo("WiringBankInformation");
              } else {
                actions.navigateTo("LoanPaymentCoin");
              }
            }}
          >
            Continue
          </CelButton>
        </RegularLayout>
      </View>
    );
  }
}

export default LoanPrepaymentPeriod;