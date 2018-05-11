import React, { Component } from "react";
import { View, Content } from 'native-base';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import _ from 'lodash';

import API from '../../../config/constants/API';
import apiUtil from '../../../utils/api-util';
import Link from '../../atoms/Link/Link';
import SelectCountry from '../../organisms/SelectCountry/SelectCountry';
import SimpleLayout from "../../layouts/SimpleLayout/SimpleLayout";
import PrimaryInput from "../../atoms/Inputs/PrimaryInput";
import * as actions from "../../../redux/actions";
import CelButton from '../../atoms/CelButton/CelButton';


// eslint-disable-next-line
const getError = (errors, field, def = null) => {
  return _.get(errors, [field, 'msg'], def)
}

@connect(
  state => ({
    nav: state.nav,
    user: state.users.user,
    error: state.users.error,
    callsInProgress: state.api.callsInProgress,
    history: state.api.history,
    lastCompletedCall: state.api.lastCompletedCall,
    getProfileInfo: state.api.getProfileInfo,
    activeScreen: state.nav.routes[state.nav.index].routeName,
  }),
  dispatch => bindActionCreators(actions, dispatch),
)
class ProfileScreen extends Component {
  componentDidMount() {
    this.props.getProfileInfo();
  }

  onScroll = event => {
    this.heading.animateHeading(event);
  };

  onSubmit = () => {
    this.props.updateProfileInfo({
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
      email: this.props.user.email,
      cellphone: this.props.user.cellphone,
      country: this.props.user.country
    })
  };

  handleUserInfoChange = (key, value) => {
    
    if (key === 'country') {
      this.props.changeProfileInfo(key, value.name)

    } else {
      this.props.changeProfileInfo(key, value)
    }  
  };

  render() {
    const { user, navigateTo } = this.props;
    const isUpdatingProfileInfo = apiUtil.areCallsInProgress([API.UPDATE_USER_PERSONAL_INFO], this.props.callsInProgress);
    const isLoadingProfileInfo = apiUtil.areCallsInProgress([API.GET_USER_PERSONAL_INFO], this.props.callsInProgress);
    /* eslint-disable */
    return (
      <SimpleLayout
        mainHeader={{ backButton: false}}
        showAvatar
      >
      <Content bounces={false} onScroll={this.onScroll} style={{marginTop: 100, marginBottom: 140}}>
        <PrimaryInput 
          type="secondary"
          labelText={getError(this.props.error, 'first_name', "First name")}
          value={user.first_name} 
          onChange={this.handleUserInfoChange.bind(this, 'first_name')} />
        <PrimaryInput 
          type="secondary" 
          labelText={getError(this.props.error, 'last_name', "Last name")}
          value={user.last_name} 
          onChange={this.handleUserInfoChange.bind(this, 'last_name')}  />
        <PrimaryInput 
          type="secondary" 
          labelText="E-mail" 
          value={user.email} 
          keyboardType='email-address' 
          onChange={this.handleUserInfoChange.bind(this, 'email')} />
        <SelectCountry 
          setCountry={this.handleUserInfoChange.bind(this, 'country')} 
          country={user.country} />
        <PrimaryInput 
          type="secondary" 
          labelText={getError(this.props.error, 'cellphone', "Phone number")}
          value={user.cellphone} 
          onChange={this.handleUserInfoChange.bind(this, 'cellphone')} />
        <View style={{marginTop: 40, marginBottom: 30}}>
          <CelButton
            onPress={() => navigateTo('ChangePassword')}
            color="blue"
          >Change password</CelButton>
        </View>
        <View style={{marginBottom: 30}}>
          <CelButton
            loading={isUpdatingProfileInfo}
            disabled={isLoadingProfileInfo}
            onPress={this.onSubmit}
            color="green"
          >Save changes</CelButton>
        </View>
        <View>
          <Link onPress={() => navigateTo('TermsOfUse')}>See Terms of Service</Link>
        </View>
      </Content>
    </SimpleLayout>
    )
    /* eslint-enable */

  }
}

export default ProfileScreen;
