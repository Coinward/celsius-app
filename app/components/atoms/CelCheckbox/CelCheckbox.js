import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View } from "react-native";
import CheckBox from "react-native-check-box";

import CelText from "../CelText/CelText";
import STYLES from "../../../constants/STYLES";
import { THEMES } from "../../../constants/UI";
import Spinner from "../Spinner/Spinner";
import Icon from "../Icon/Icon";

const checked = (
  <Icon
    name="CheckedBorder"
    width="23"
    height="23"
    fill={STYLES.COLORS.GREEN}
  />
);

const unchecked = (
  <Icon name="Unchecked" width="23" height="23" fill={STYLES.COLORS.GRAY} />
);

const CelCheckbox = ({
  field,
  updateFormField,
  onChange,
  value,
  rightText,
  checkedImage = checked,
  unCheckedImage = unchecked,
  textWeight,
  loading,
  theme,
  fillColor,
}) => {
  const onPress = onChange || updateFormField;

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", marginBottom: 15, alignItems: "center" }}
      onPress={() => onPress(field, !value)}
    >
      {loading ? (
        <View style={{ marginRight: 10 }}>
          <Spinner size={24} />
        </View>
      ) : (
        <CheckBox
          checkBoxColor={STYLES.COLORS.MEDIUM_GRAY}
          checkedCheckBoxColor={STYLES.COLORS.GREEN}
          style={{ paddingRight: 10 }}
          onClick={() => onPress(field, !value)}
          isChecked={value}
          checkedImage={checkedImage}
          unCheckedImage={unCheckedImage}
        />
      )}

      {rightText && (
        <CelText
          type="H4"
          weight={textWeight}
          color={fillColor}
          style={{ marginRight: 30 }}
          theme={theme}
        >
          {rightText}
        </CelText>
      )}
    </TouchableOpacity>
  );
};

CelCheckbox.propTypes = {
  field: PropTypes.string.isRequired,
  updateFormField: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  rightText: PropTypes.string,
  checkedImage: PropTypes.element,
  unChecked: PropTypes.element,
  textWeight: PropTypes.string,
  loading: PropTypes.bool,
  theme: PropTypes.oneOf(Object.values(THEMES)),
  fillColor: PropTypes.string,
};

export default CelCheckbox;
