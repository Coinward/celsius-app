import { StatusBar, Platform } from 'react-native';

import { getThemedStyle } from '../../../utils/styles-util';
import STYLES from '../../../constants/STYLES';

const base = {
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60
  },

  center: {
    alignSelf: 'center',
    justifyContent: 'center'
  },

  left: {
    flex: 1,
    alignItems: 'flex-start'
  },

  right: {
    flex: 1,
    alignItems: 'flex-end',
  },

  headingBackground: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    ...STYLES.SHADOW_STYLES
  },

  transparentBackground: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  },

  sameBackground: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    ...STYLES.SHADOW_STYLES
  },

  button: {
    borderRadius: 17,
    overflow: 'hidden',
    borderColor: 'black'

  },
  // image: {
  //     borderRadius: 17,
  //     color: 'red'
  // }
}

const themed = {

  light: {
    headingBackground: {
      backgroundColor: STYLES.COLORS.WHITE,
    },
    sameBackground: {
      backgroundColor: STYLES.COLORS.LIGHT_GRAY
    }
  },

  dark: {
    headingBackground: {
      backgroundColor: STYLES.COLORS.DARK_HEADER
    },
    sameBackground: {
      backgroundColor: STYLES.COLORS.DARK_BACKGROUND
    }
  },

  celsius: {
    headingBackground: {
      backgroundColor: STYLES.COLORS.CELSIUS
    },
    sameBackground: {
      backgroundColor: STYLES.COLORS.LIGHT_GRAY
    }
  },
}

const CelHeadingStyle = () => getThemedStyle(base, themed);

export default CelHeadingStyle
