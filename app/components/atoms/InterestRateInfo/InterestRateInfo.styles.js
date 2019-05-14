import { getThemedStyle, heightPercentageToDP, widthPercentageToDP } from "../../../utils/styles-util";
import STYLES from "../../../constants/STYLES";

const currencyImageSize = widthPercentageToDP("10.67%");

const base = {
  container: {
    flex: 1
  },
  mainWrapper: {
    paddingVertical: 11,
    marginVertical: 15
  },
  mainWrapperCompact: {
    borderTopWidth: 0,
    marginVertical: 0
  },
  mainInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  imageWrapper: {
    width: currencyImageSize,
    height: currencyImageSize,
    marginRight: 11,
  },
  currencyImage: {
    width: currencyImageSize,
    height: currencyImageSize
  },
  infoWrapper: {
  },
  currencyName: {
    marginBottom: 2
  },
  currencyShort: {
    color: STYLES.DARK_GRAY,
  },
  imageInfoWrapper: {
    flexDirection: "row",
    paddingVertical: heightPercentageToDP("3.5%"),
    marginLeft: 10,
    alignItems: 'center'
  },
  celRateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: STYLES.COLORS.GREEN,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: widthPercentageToDP("32%"),
    height: heightPercentageToDP("5%")
  },
  regularRateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    height: heightPercentageToDP("5%")
  },
  usdInfoWrapper: {
    marginTop: 10,
    backgroundColor: STYLES.COLORS.DARK_GRAY,
    borderRadius: 5,
    padding: 10
  },
  regularRateText: {
    color: STYLES.COLORS.MEDIUM_GRAY,
    fontFamily: "barlow-regular",
  },
  celRateText: {
    color: "#fff",
    fontFamily: "barlow-semi-bold",
  },
  regRateText: {
    color: STYLES.COLORS.MEDIUM_GRAY,
    fontFamily: "barlow-semi-bold",
  },
  celsiusRateText: {
    color: "#fff",
    fontFamily: "barlow-regular",
  }
};

const themed = {
  light: {},

  dark: {},

  celsius: {}
};

const InterestRateInfoStyle = () => getThemedStyle(base, themed);

export default InterestRateInfoStyle;
