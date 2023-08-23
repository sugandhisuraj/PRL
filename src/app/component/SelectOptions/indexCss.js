
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {

    },
    titleTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: 'white'
    },
    oContainer: {
        marginTop: getHp(8),
        marginLeft: getHp(20)
    },
    scrollOContainer: {
        marginTop: getHp(8),
        marginLeft: getHp(20),
        maxHeight: getHp(200), 
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getHp(12),
    },
    optionItemTextStyle: {
        fontSize: FONTSIZE.Text16,
        color: 'white',
        marginLeft: getHp(20)
    },
    checkboxStyle: {
        width: getHp(15),
        height: getHp(15),
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: getHp(30)
    },
    checkBoxFillStyle: {
        backgroundColor: 'white',
    }
});