import STYLES from '../../../constants/STYLES';
import { getThemedStyle, heightPercentageToDP, widthPercentageToDP } from "../../../utils/styles-util";

const base = {
  container: {
    flex: 1
  },
  mainContainer: {
    height: heightPercentageToDP("33%"),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 40,
    paddingVertical: 10
  },
  arcChart: {
    marginHorizontal: widthPercentageToDP("8%")
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  celContainer: {
    paddingRight: 5,
  },
  otherCoinsContainer: {
    paddingVertical: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  bottomContainer: {
    marginTop: 5,
    flexDirection: 'column',
   
  }
};

const themed = {
  light: {
    minPercentage: {
      backgroundColor: STYLES.COLORS.WHITE
    },
    bonus: {
      backgroundColor: STYLES.COLORS.WHITE
    },
    loan: {
      backgroundColor: STYLES.COLORS.WHITE,
    },
    separator: {
      backgroundColor: STYLES.COLORS.MEDIUM_GRAY3
    },
    tierSilver: {
      backgroundColor: STYLES.COLORS.MEDIUM_GRAY,
    }
  },

  dark: {
    minPercentage: {
      backgroundColor: STYLES.COLORS.DARK_HEADER
    },
    bonus: {
      backgroundColor: STYLES.COLORS.DARK_HEADER
    },
    loan: {
      backgroundColor: STYLES.COLORS.DARK_HEADER,
    },
    separator: {
      backgroundColor: 'rgb(95,105,122)'
    },
    tierSilver: {
      borderColor: '#000',
      borderRightWidth: 2,
    },
    tierGold: {
      borderColor: '#000',
      borderRightWidth: 2,
    },
    tierPlatinum: {
      borderColor: '#000'
    },
    tierWrapper: {
      borderBottomColor: '#000',
    }
  },

  celsius: {}
}
const MyCelHeaderStyle = () => getThemedStyle(base, themed);

export default MyCelHeaderStyle;
