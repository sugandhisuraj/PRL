
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        marginTop: getHp(15),
        width: '90%',
        alignSelf: 'center'
    },
    questionTextStyle: {
        fontWeight: 'bold',
        color: '#01080C',
        fontSize: FONTSIZE.Text16
    },
    textInputStyle: {
        marginVertical: getHp(15),
        height: getHp(40),
        color: 'black'
    }
});