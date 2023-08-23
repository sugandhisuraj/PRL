
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    textInputStyle: {
        height: getHp(55),
        borderRadius: getWp(10),
        borderWidth: .3,
        borderColor: "#000",
        paddingHorizontal: getHp(12),
        alignItems: "center",
    }
});