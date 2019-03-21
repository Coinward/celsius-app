import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

import testUtil from "../../../utils/test-util";

import TransactionRowStyle from "./TransactionRow.styles";
import Icon from '../Icon/Icon';
import CelText from '../CelText/CelText';
import formatter from '../../../utils/formatter';
import Separator from '../Separator/Separator';
import transactionsUtil from "../../../utils/transactions-util";

class TransactionRow extends Component {

  static propTypes = {
    transaction: PropTypes.instanceOf(Object).isRequired,
    onPress: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };
  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      transactionProps: {
        color: '',
        iconName: '',
        statusText: ''
      }
    };
  }

  render() {
    const { transaction, onPress, count, index } = this.props;
    if (!transaction) return null;

    const { color, iconName, statusText } = transactionsUtil.getTransactionsProps(transaction);

    const style = TransactionRowStyle()
    return (
      <View>
        <TouchableOpacity style={style.container} onPress={onPress}>
          <View style={style.leftSide}>
            <View style={style.iconStyle}>
              <Icon name={iconName} height='18' width='15' fill={color} />
            </View>
            <View style={style.amounts}>
              <View>
                <CelText  weight="semi-bold" type='H3'>{formatter.usd(transaction.amount_usd)}</CelText>
              </View>
              <View>
                <CelText type='H6' weight="light">{formatter.crypto(transaction.amount, transaction.coin.toUpperCase(), { precision: 5 })}</CelText>
              </View>
            </View>
          </View>

          <View style={style.rightSide}>
            <View style={style.statusText}>
              <CelText type='H6' weight="medium" color={color}>{statusText}</CelText>
            </View>
            <View>
              <CelText type='H6' weight="light">{transaction.time}</CelText>
            </View>
          </View>

        </TouchableOpacity>
        {count - 1 !== index && <Separator/>}
      </View>
    );
  }
}

export default testUtil.hookComponent(TransactionRow);
