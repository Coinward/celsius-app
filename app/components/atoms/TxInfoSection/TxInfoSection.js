import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import InfoSectionStyle from "./TxInfoSection.styles";
import CelText from "../CelText/CelText";
import formatter from "../../../utils/formatter";
import STYLES from "../../../constants/STYLES";

const TxInfoSection = ({ transaction, transactionProps }) => {
  const style = InfoSectionStyle();
  return (
    <View style={style.container}>
      <View style={style.statusText}>
        <View
          style={[style.circle, { backgroundColor: transactionProps.color }]}
        >
          <CelText type={"H7"} color={STYLES.COLORS.WHITE}>
            {transactionProps.shortName}
          </CelText>
        </View>
        <CelText color={transactionProps.color}>
          {transactionProps.statusText}
        </CelText>
      </View>

      <CelText margin="0 0 10 0" type="H1" align="center">
        {formatter.crypto(transaction.amount, transaction.coin.toUpperCase(), {
          precision: 5,
        })}
      </CelText>
      <CelText color={STYLES.COLORS.MEDIUM_GRAY} type="H3" align="center">
        {transaction.amount_usd
          ? formatter.usd(transaction.amount_usd)
          : `${formatter.fiat(
              transaction.fiat_amount,
              transaction.fiat_currency
            )}`}
      </CelText>
    </View>
  );
};

TxInfoSection.propTypes = {
  transaction: PropTypes.instanceOf(Object),
  transactionProps: PropTypes.instanceOf(Object),
};

export default TxInfoSection;
