
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#EDCF80",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: getHp(8)
    },
    placeholderTextStyle: {
        color: "#000000",
        fontSize: FONTSIZE.Text16,
        fontWeight: "bold"
    }
});