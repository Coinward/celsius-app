import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from '../../../redux/actions'

import testUtil from "../../../utils/test-util";
import { setSecureStoreKey } from '../../../utils/expo-storage'
import { MODALS } from '../../../constants/UI'
import CelButton from "../../atoms/CelButton/CelButton";
import CelText from '../../atoms/CelText/CelText';
import CelModal from "../CelModal/CelModal";


@connect(
  state => ({
    referralLink: state.branch.registeredLink,
    appSettings: state.user.appSettings,
    celMemberStatus: state.user

  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)

class EarnInterestCelModal extends Component {
  static propTypes = {
  };
  static defaultProps = {};

  changeInterestEarn = () => {
    const { actions, appSettings } = this.props
    if (!appSettings) return null;

    const changesInterestEarn = !appSettings.interest_in_cel
    actions.setUserAppSettings({
      interest_in_cel: changesInterestEarn
    })
    this.setState({ interestInCel: changesInterestEarn })
  }

  render() {
    const { actions } = this.props
    return (
      <CelModal
        name={MODALS.EARN_INTEREST_CEL}
        picture={require('../../../../assets/images/Onboarding-Welcome3x.png')}
      >
        <CelText type="H2" align="center" weight='bold' margin="15 0 15 0">It's time to CELebrate!</CelText>

        <CelText align="center">
          You can now earn up to 25% more on deposits when you earn in CEL.
      </CelText>

        <CelButton onPress={() => {
          this.changeInterestEarn()
          actions.closeModal()

        }}
          margin="15 0 10 0">Activate interest in CEL</CelButton>
        <CelButton basic onPress={async () => {
          actions.closeModal()
          await setSecureStoreKey('HIDE_MODAL_INTEREST_IN_CEL', 'ON');
        }}>Not now</CelButton>
      </CelModal>
    )
  }
}

export default testUtil.hookComponent(EarnInterestCelModal);
