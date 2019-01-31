import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import RegisterStyle from "./Register.styles";
import CelText from '../../atoms/CelText/CelText';
import CelInput from '../../atoms/CelInput/CelInput';
import CelButton from '../../atoms/CelButton/CelButton';
import Separator from '../../atoms/Separator/Separator';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';

@connect(
  state => ({
    style: RegisterStyle(state.ui.theme),
    formData: state.forms.formData
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class Register extends Component {

  render() {
    const { formData, actions } = this.props;
    const header = {
      right: "login",
      children: <ProgressBar steps={5} currentStep={1} />
    }
    return (
      <AuthLayout header={header}>
        <CelText type="H1" align="center">Join Celsius</CelText>
        <CelInput type="text" field="firstname" placeholder="First name" />
        <CelInput type="text" field="lastname" placeholder="Last name" />
        <CelInput type="text" field="email" placeholder="E-mail" />
        <CelInput type="password" field="password" placeholder="Password" value={formData.password} />
        <CelButton onPress={() => { actions.navigateTo('EnterPhone') }} iconRight="IconArrowRight">Create account</CelButton>
        <Separator text="or Register with social media" />
      </AuthLayout>
    );
  }
}

export default testUtil.hookComponent(Register);
