// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from '../../../utils/styles-util';

const base = {
    container: {
        flex: 1
    },
  amount: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  buttonsWrapper: {
    justifyContent: "flex-end",
    marginTop: 20,
    height: 50,
  }
}

const themed = {
    light: {
    },

    dark: {
    },

    celsius: {
    }
}

const ConfirmCelPayModalStyle = () => getThemedStyle(base, themed);

export default ConfirmCelPayModalStyle
