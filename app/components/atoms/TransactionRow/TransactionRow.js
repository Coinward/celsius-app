import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";

import TransactionRowStyle from "./TransactionRow.styles";
import Icon from "../Icon/Icon";
import CelText from "../CelText/CelText";
import formatter from "../../../utils/formatter";
import Separator from "../Separator/Separator";

class TransactionRow extends Component {
  static propTypes = {
    transaction: PropTypes.instanceOf(Object).isRequired,
    onPress: PropTypes.func,
    count: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };
  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      transactionProps: {
        color: "",
        iconName: "",
        statusText: "",
      },
    };
  }

  render() {
    const { transaction, onPress, count, index } = this.props;
    if (!transaction) return null;

    const { color, iconName, statusText } = transaction.uiProps;

    const style = TransactionRowStyle();
    return (
      <View>
        <TouchableOpacity style={style.container} onPress={onPress}>
          <View style={style.leftSide}>
            <Icon name={iconName} height="16" width="16" fill={color} />
            <View style={style.amounts}>
              <View>
                <CelText weight="600" type="H3">
                  {transaction.amount_usd
                    ? formatter.usd(transaction.amount_usd)
                    : formatter.fiat(
                        transaction.fiat_amount,
                        transaction.fiat_currency
                      )}
                </CelText>
              </View>
              <View>
                <CelText type="H6" weight="200">
                  {formatter.crypto(
                    transaction.amount,
                    transaction.coin.toUpperCase(),
                    { precision: 5 }
                  )}
                </CelText>
              </View>
            </View>
          </View>

          <View style={style.rightSide}>
            <View style={style.statusText}>
              <CelText type="H6" weight="medium" color={color}>
                {statusText}
              </CelText>
            </View>
            <View>
              <CelText type="H6" weight="200">
                {transaction.time}
              </CelText>
            </View>
          </View>
        </TouchableOpacity>
        {count - 1 !== index && <Separator />}
      </View>
    );
  }
}

export default TransactionRow;
