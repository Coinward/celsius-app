import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import CelText from "../../atoms/CelText/CelText";
import CelButton from "../../atoms/CelButton/CelButton";
import * as appActions from "../../../redux/actions";

// TODO should probably be a static screen
@connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class TooManyRequests extends Component {
  render() {
    return (
      <RegularLayout fabType="hide">
        <CelText
          margin="20 0 15 0"
          align="center"
          type="H2"
          weight={"700"}
          bold
        >
          Too many requests
        </CelText>
        <CelText margin="5 0 15 0" align="center" type="H4" weight={"300"}>
          Yikes, it looks like you made several wrong attempts in a short period
          of time. You will be able to use the application again in less than an
          hour. You can reach out to our support team at app@celsius.network.
        </CelText>
        <CelButton
          margin="40 0 0 0"
          color="blue"
          onPress={this.props.actions.navigateBack}
        >
          Try again
        </CelButton>
      </RegularLayout>
    );
  }
}

export default TooManyRequests;
