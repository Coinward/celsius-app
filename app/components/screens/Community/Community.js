import React, { Component } from 'react';

import testUtil from "../../../utils/test-util";
import StaticScreen from "../StaticScreen/StaticScreen";
import { EMPTY_STATES } from "../../../constants/UI";


class Community extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      header: {
        title: "Celsius Community",
        right: "profile"
      }
    };
  }

  render() {
    const { header } = this.state;
    return (
      <StaticScreen
        header={header}
        emptyState={{ purpose: EMPTY_STATES.NO_DATA }}
      />
    );
  }
}

export default testUtil.hookComponent(Community);
