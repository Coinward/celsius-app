import { Platform } from 'react-native'
import STYLES from '../../../constants/STYLES'
import { getThemedStyle } from '../../../utils/styles-util'

const base = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 8,
    marginVertical: 20,
    minHeight: 50,
    ...Platform.select({
      android: {
        borderColor: '#E9E9E9',
        borderTopWidth: 0.2,
        borderLeftWidth: 0.2,
        borderRightWidth: 0.5,
        borderBottomWidth: 2
      },
      ios: {
        ...STYLES.SHADOW_STYLES
      }
    })
  }
}

const themed = {
  light: {
    container: {
      backgroundColor: STYLES.COLORS.WHITE
    },
    textColor: {
      color:  STYLES.COLORS.DARK_GRAY6
    }
  },

  dark: {
    container: {
      backgroundColor: STYLES.COLORS.DARK_HEADER
    },
    textColor: {
      color:  STYLES.COLORS.WHITE
    }
  },

  celsius: {
    container: {
      backgroundColor: STYLES.COLORS.WHITE
    },
    textColor: {
      color:  STYLES.COLORS.DARK_GRAY6
    }
  }
}

const IconButtonStyle = () => getThemedStyle(base, themed)

export default IconButtonStyle
