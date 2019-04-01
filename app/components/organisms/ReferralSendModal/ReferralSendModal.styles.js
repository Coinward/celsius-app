import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from '../../../utils/styles-util';

const base = {
    container: {
        flex: 1
    },
    copyShareWrapper: {
        width: '100%',
        marginTop: 15,
        borderColor: STYLES.COLORS.LIGHT_GRAY,
        borderWidth: 2,
        borderRadius: 8,
        padding: 20
      },
    
      copyShareButtonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 15
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

const ReferralSendModalStyle = () => getThemedStyle(base, themed);

export default ReferralSendModalStyle