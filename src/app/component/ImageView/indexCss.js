
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    imageViewContainer: {
        height: getHp(90),
        width: getHp(90),
        backgroundColor: '#C4C4C4'
    },
    imageStyle: {
        flex: 1,
        height: getHp(90),
        width: getHp(90),
        resizeMode: 'contain'
    }
});