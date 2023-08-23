
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.3,
        borderBottomColor: '#000',
        paddingHorizontal: getHp(25)
    },
    textStyle: {
        fontWeight: '400',
        fontSize: FONTSIZE.Text16,
        color: 'black',
        marginLeft: getWp(15)
    },
    textInputStyle: {
        // borderWidth:1,
        // borderColor: 'red',
        //height: getHp(20),
        minWidth: getWp(50),
        maxWidth: getWp(50),
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'black'
    },
    rightViewStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    leftViewStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    dollarTextStyle: {
        alignSelf: 'center',
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'black'
    },
    checkBoxStyle: {
        height: getHp(26),
        width: getHp(26),
        borderWidth: getHp(2),
        borderColor: '#0B214D'
    },
    checkedStyle: {
        backgroundColor: '#0B214D'
    }
});