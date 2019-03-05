import React, { Component } from 'react';
// import { View } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
// import BorrowBankAccountStyle from "./BorrowBankAccount.styles";
import CelText from '../../atoms/CelText/CelText';
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';
import CelButton from '../../atoms/CelButton/CelButton';

@connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class BorrowBankAccount extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      header: {
        title: "BorrowBankAccount Screen",
        left: "back",
        right: "profile"
      }
    };
  }

  render() {
    const { header } = this.state;
    const { actions } = this.props;
    // const style = BorrowBankAccountStyle();
    
    return (
      <RegularLayout header={header}>
        <CelText>Hello BorrowBankAccount</CelText>

        <CelButton onPress={() => actions.navigateTo('VerifyProfile', { onSuccess: () => actions.navigateTo('BorrowConfirm') })}>
          Verify Profile
        </CelButton>
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(BorrowBankAccount);
