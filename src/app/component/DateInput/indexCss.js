import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    dateTouchContainer: {
        width: getWp(110),
        //height: getHp(53),
        //padding: getHp(6),
        borderWidth: .3,
        borderRadius: getHp(8),
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: getHp(6)
    },
    textStyle: {
        fontSize: FONTSIZE.Text14,
        color: "#000",
        textAlign: "center"
    }
})