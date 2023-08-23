
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    containerStyle: {
        backgroundColor: '#EDCF80',
        width: getWp(280),
        height: getHp(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getHp(100),
        alignSelf: 'center'
    },
    labelTextStyle: {
        fontSize: FONTSIZE.Text16,
        color: 'black'
    }
});





