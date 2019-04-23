import React, { Component } from 'react';
// import { View } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
// import ApiAuthorizationStyle from "./ApiAuthorization.styles";
import CelText from '../../atoms/CelText/CelText';
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';
import CelButton from "../../atoms/CelButton/CelButton";
import Separator from "../../atoms/Separator/Separator";
import STYLES from "../../../constants/STYLES";
import CelApiDropdown from "../../molecules/CelApiDropdown/CelApiDropdown";

@connect(
  state => ({
    apiKeys: state.apiKeys.keys
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class ApiAuthorization extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {
  }

  static navigationOptions = () => ({
    title: "Api Authorization",
  });

  componentDidMount() {
    const { actions } = this.props;
    actions.getAllAPIKeys()
  }

  componentDidUpdate(prevProps ) {
    const { actions } = this.props;

    if (prevProps.apiKeys.length <= this.props.apiKeys.length) {
      return actions.getAllAPIKeys()
    }
  }


  render() {
    // const style = ApiAuthorizationStyle();
    const { apiKeys, actions } = this.props;


    return (
      <RegularLayout>
        <CelText color={STYLES.COLORS.MEDIUM_GRAY} type={"H4"} weight={"400"}>Generate a secure API key that enables external services to read some of the Celsius data. </CelText>

        <CelButton
          onPress={() => actions.navigateTo("ApiAuthorizationPermissions")}
          margin={"30 0 10 0"}
        >
          Generate API key
        </CelButton>

        {!!apiKeys && apiKeys.length > 0 && <Separator margin={"30 0 24 0"} />}

        {!!apiKeys &&
          apiKeys.map(apiKey => (
            <CelApiDropdown apiKey={apiKey} key={apiKey.id}>
              {apiKey.lastFourCharacters}
            </CelApiDropdown>
          ))
        }
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(ApiAuthorization);
