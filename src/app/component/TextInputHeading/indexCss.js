
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        width: "85%",
        alignSelf: "center",
        marginTop: getHp(20)
    },
    paymentTermTextStyle: {
        fontWeight : '700',
        fontSize: FONTSIZE.Text16,
        color: 'black'
    },
    eventDescriptionTextStyle: {
        marginTop: getHp(10),
        height: getHp(55),
        borderWidth: 0,
        width: wp(85),
        alignSelf: "center",
        color: "black",
        fontSize: FONTSIZE.Text15,
        //marginLeft: getWp(10)
    },
});