import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import GetCoinsEnterAmountStyle from "./GetCoinsEnterAmount.styles";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import STYLES from "../../../constants/STYLES";
import CoinPicker from "../../molecules/CoinPicker/CoinPicker";
import CelNumpad from "../../molecules/CelNumpad/CelNumpad";
import { KEYPAD_PURPOSES, MODALS } from "../../../constants/UI";
import CoinSwitch from "../../atoms/CoinSwitch/CoinSwitch";
import formatter from "../../../utils/formatter";
import CelButton from "../../atoms/CelButton/CelButton";
import CelText from "../../atoms/CelText/CelText";
import GetCoinsConfirmModal from "../../modals/GetCoinsConfirmModal/GetCoinsConfirmModal";
import { heightPercentageToDP } from "../../../utils/styles-util";

@connect(
  state => ({
    walletSummary: state.wallet.summary,
    formData: state.forms.formData,
    keypadOpen: state.ui.isKeypadOpen,
    currencyRatesShort: state.currencies.currencyRatesShort,
    buyCoinsSettings: state.generalData.buyCoinsSettings,
    depositCompliance: state.compliance.deposit,
    currencies: state.currencies.rates,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class GetCoinsEnterAmount extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Buy Coins",
    right: "profile",
  });

  constructor(props) {
    super(props);
    const {
      currencies,
      depositCompliance,
      buyCoinsSettings,
      actions,
    } = this.props;

    const availableCoins = currencies
      .filter(c => depositCompliance.coins.includes(c.short))
      .filter(c => buyCoinsSettings.supported_coins.includes(c.short))
      .map(c => ({
        label: `${formatter.capitalize(c.name)} (${c.short})`,
        value: c.short,
      }));

    actions.updateFormFields({
      amountUsd: "",
      amountCrypto: "",
    });
    this.state = {
      availableCoins,
    };
  }

  handleCoinSelect = (field, value) => {
    const { actions } = this.props;
    actions.updateFormFields({
      [field]: value,
      amountUsd: "",
      amountCrypto: "",
    });
  };

  handleNextStep = () => {
    const { buyCoinsSettings, formData, actions } = this.props;

    if (Number(formData.amountUsd) < buyCoinsSettings.min_payment_amount) {
      return actions.showMessage("warning", `Minimum amount you can buy is ${formatter.usd(buyCoinsSettings.min_payment_amount)}`);
    }

    if (Number(formData.amountUsd) > buyCoinsSettings.max_payment_amount) {
      return actions.showMessage("warning", `Maximum amount you can buy is ${formatter.usd(buyCoinsSettings.max_payment_amount)}`);
    }

    actions.simplexGetQuote();
    actions.openModal(MODALS.GET_COINS_CONFIRM_MODAL);
  };

  coinPrice = coin => {
    const { currencies } = this.props;

    const selectedCoin = currencies && currencies.find(c => c.short === coin);
    return selectedCoin;
  };

  getUsdValue = amountUsd =>
    formatter.removeDecimalZeros(formatter.floor10(amountUsd, -2) || "");

  handleAmountChange = (newValue) => {
    const { formData, currencyRatesShort, actions } = this.props;
    const coinRate = currencyRatesShort[formData.coin.toLowerCase()];

    const splitedValue = newValue.toString().split(".");

    if (splitedValue && splitedValue.length > 2) return;

    let amountUsd;
    let amountCrypto;

    if (formData.isUsd) {
      // if no predefined label is forwarded and the value is in usd
      amountUsd = formatter.setCurrencyDecimals(newValue, "USD");
      amountCrypto = amountUsd / coinRate;

      // if no predefined label is forwarded and the value is no in usd (crypto)
    } else {
      amountCrypto = formatter.setCurrencyDecimals(newValue);
      amountUsd = amountCrypto * coinRate;
      amountUsd = this.getUsdValue(amountUsd);
      if (amountUsd === "0") amountUsd = "";
    }

    // Change value '.' to '0.'
    if (amountUsd[0] === ".") amountUsd = `0${amountUsd}`;
    // if the crypto amount is eg. 01 the value will be 1, 00 -> 0
    if (amountUsd.length > 1 && amountUsd[0] === "0" && amountUsd[1] !== ".") {
      amountUsd = amountUsd[1];
    }

    // if crypto amount is undefined, set it to empty string
    if (!amountCrypto) amountCrypto = "";
    // Change value '.' to '0.'
    if (amountCrypto[0] === ".") amountCrypto = `0${amountCrypto}`;
    // if the crypto amount is eg. 01 the value will be 1, 00 -> 0
    if (
      amountCrypto.length > 1 &&
      amountCrypto[0] === "0" &&
      amountCrypto[1] !== "."
    ) {
      amountCrypto = amountCrypto[1];
    }

    actions.updateFormFields({
      amountCrypto: amountCrypto.toString(),
      amountUsd,
    });
  };

  render() {
    const { actions, formData, keypadOpen } = this.props;
    const { availableCoins } = this.state;
    const style = GetCoinsEnterAmountStyle();

    const coinPrice =
      this.coinPrice(formData.coin) &&
      this.coinPrice(formData.coin).market_quotes_usd.price;
    return (
      <RegularLayout fabType={"hide"} padding={"0 0 0 0"}>
        <View style={style.fiatSection}>
          <View style={style.amounts}>
            <CoinPicker
              type={"basic"}
              updateFormField={actions.updateFormField}
              onChange={this.handleCoinSelect}
              coin={formData.coin}
              field="coin"
              defaultSelected={formData.coin || "BTC"}
              availableCoins={availableCoins}
              navigateTo={actions.navigateTo}
            />
            <CoinSwitch
              updateFormField={actions.updateFormField}
              onAmountPress={actions.toggleKeypad}
              amountUsd={formData.amountUsd}
              amountCrypto={formData.amountCrypto}
              isUsd={formData.isUsd}
              coin={formData.coin}
              doubleTilde
              amountColor={
                keypadOpen
                  ? STYLES.COLORS.CELSIUS_BLUE
                  : STYLES.COLORS.DARK_GRAY
              }
            />
          </View>
        </View>
        <CelText
          align={"center"}
          color={STYLES.COLORS.MEDIUM_GRAY}
          margin={"25 0 15 0"}
        >
          1 {formData.coin} ≈ {coinPrice}$
        </CelText>
        <CelButton
          margin="10 0 0 0"
          disabled={!(formData.amountUsd && Number(formData.amountUsd) > 0)}
          onPress={this.handleNextStep}
          iconRight={
            formData.amountUsd && Number(formData.amountUsd) > 0
              ? "IconArrowRight"
              : ""
          }
        >
          {formData.amountUsd && Number(formData.amountUsd) > 0
            ? "Buy Coins"
            : "Enter amount above"}
        </CelButton>
        <CelNumpad
          field={formData.isUsd ? "amountUsd" : "amountCrypto"}
          value={formData.isUsd ? formData.amountUsd : formData.amountCrypto}
          toggleKeypad={actions.toggleKeypad}
          updateFormField={actions.updateFormField}
          setKeypadInput={actions.setKeypadInput}
          onPress={this.handleAmountChange}
          purpose={KEYPAD_PURPOSES.BUY_COINS}
          autofocus
        />
        <GetCoinsConfirmModal/>
      </RegularLayout>
    );
  }
}

export default GetCoinsEnterAmount;