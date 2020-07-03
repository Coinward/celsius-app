import STYLES from "../../../constants/STYLES";
import { getThemedStyle } from "../../../utils/styles-util";

const base = {
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
};

const themed = {
  light: {
    text: {
      color: STYLES.COLORS.MEDIUM_GRAY,
    },
  },

  dark: {
    text: {
      color: STYLES.COLORS.CELSIUS_BLUE,
    },
  },

  unicorn: {},
};

const ShareButtonStyle = () => getThemedStyle(base, themed);

export default ShareButtonStyle;
