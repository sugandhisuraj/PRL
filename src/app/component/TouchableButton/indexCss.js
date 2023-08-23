
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    containerStyle: {
        height: getHp(50),
        borderRadius: getHp(15),
        backgroundColor: '#0B214D',
        alignItems: 'center',
        flexDirection: 'row'
    },
    redBig: {
        backgroundColor: '#EC2939',
        borderRadius: getHp(15),
        height: getHp(50),
        paddingVertical: getHp(5)
    },
    titleStyle: {
        fontSize: FONTSIZE.Text18,

    },
    small: {
        backgroundColor: "#EC2939",
        width: getWp(104),
        height: 40,
        borderRadius: getWp(100)
    },
    iconStyle: {
        height: getHp(25),
        width: getHp(25),
        marginLeft: getWp(40)
    },
    textTitleStyle: {
        marginLeft: getWp(30),
        color: 'white',
        fontSize: FONTSIZE.Text16,
        fontWeight: '700'
    },
    paymentBTN: {
        backgroundColor: '#0B214D',
        height: getHp(50),
        paddingVertical: getHp(5),
        borderRadius: getHp(15)
    },
    nextStep: {
        width: getWp(167),
        height: getHp(43),
        borderRadius: getHp(15),
        backgroundColor: `#0B214D`
    },
    prevStep: {
        shadowColor: '#DCE4F9',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 2,
        borderRadius: getWp(10),
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: getHp(43),
        width: getWp(167)
    },
    prevTitleStyle: {
        color: 'black',
        fontWeight: '700',
        fontSize: FONTSIZE.Text16
    }
});