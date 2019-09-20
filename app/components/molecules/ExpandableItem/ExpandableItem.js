import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";

import ExpandableItemStyle from "./ExpandableItem.styles";
import CelText from "../../atoms/CelText/CelText";
import Icon from "../../atoms/Icon/Icon";
import { THEMES } from "../../../constants/UI";
import STYLES from "../../../constants/STYLES";
import { getMargins, getTheme } from '../../../utils/styles-util'

class ExpandableItem extends Component {
  static propTypes = {
    heading: PropTypes.string,
    margin: PropTypes.string,
  };
  static defaultProps = {
    margin: "0 0 0 0",
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };
  }

  renderSeparator = () => {
    const style = ExpandableItemStyle();
    const { isExpanded } = this.state;
    const theme = getTheme();
    const { heading, margin } = this.props;

    const margins = getMargins(margin)

    return (
      <TouchableOpacity
        style={[
            style.container,
            margins,
          ]
        }
        onPress={() => this.setState({ isExpanded: !isExpanded })}
      >
        <View style={style.leftSegment} />
        <View style={style.left} />

        <CelText align={"center"} type={"H6"} style={style.centralText} allCaps>
          {heading}
        </CelText>

        <View style={style.right} />
        <Icon
          name={isExpanded ? "Collapse" : "Expand"}
          height="21"
          width="21"
          fill={
            theme === THEMES.DARK
              ? STYLES.COLORS.WHITE_OPACITY5
              : STYLES.COLORS.GRAY
          }
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { children, heading } = this.props;
    const { isExpanded } = this.state;

    return (
      <>
        {heading && this.renderSeparator()}
        {isExpanded && <View>{children}</View>}
      </>
    );
  }
}

export default ExpandableItem;
