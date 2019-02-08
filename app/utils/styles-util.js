// TODO(fj): check normalize
// TODO(fj): more use of padding and margin
// TODO(fj): add scale util here

import { Dimensions, Platform, PixelRatio, Text, TextInput, StyleSheet } from "react-native";
import formatter from './formatter';
import store from '../redux/store';
// import _ from 'lodash';

export default {
  getMargins,
  getPadding,
  getScaledFont,
  normalize,
  getThemedStyle,
  disableAccessibilityFontScaling
};

const { width, height } = Dimensions.get("window");

function getMargins(margin) {
  if (!margin) return getMargins("0 0 0 0");

  const margins = margin.split(" ");
  if (margins.length !== 4) return getMargins();

  return StyleSheet.create({
    margins: {
      marginTop: Number(margins[0]),
      marginRight: Number(margins[1]),
      marginBottom: Number(margins[2]),
      marginLeft: Number(margins[3])
    }
  }).margins;
}

function getPadding(padding) {
  if (!padding) return getPadding("0 0 0 0");

  const paddings = padding.split(" ");
  if (paddings.length !== 4) return getPadding();

  return StyleSheet.create({
    paddings: {
      paddingTop: Number(paddings[0]),
      paddingRight: Number(paddings[1]),
      paddingBottom: Number(paddings[2]),
      paddingLeft: Number(paddings[3])
    }
  }).paddings;
}

const {
  width: SCREEN_WIDTH
  // height: SCREEN_HEIGHT,
} = Dimensions.get("window");

// based on iphone X's scale
const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;

}

export function getThemedStyle(base, themed, theme = store.getState().ui.theme) {
  return StyleSheet.create(formatter.deepmerge(base, themed[theme]));
  // return StyleSheet.flatten([StyleSheet.create(base), StyleSheet.create(themed[theme])])
  // return StyleSheet.create(_.merge({ ...base }, { ...themed[theme] }));
  // return _.mergeWith({ ...base }, { ...themed[theme] });
  // return formatter.deepmerge(base, themed[theme])
}

function disableAccessibilityFontScaling() {
  // disables letter sizing in phone's Accessibility menu
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;

  // same same as with Text, but different
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
export const widthPercentageToDP = widthPercent => {
  const screenWidth = width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
export const heightPercentageToDP = heightPercent => {
  const screenHeight = height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export function getScaledFont(fontSize) {
  return fontSize;
}