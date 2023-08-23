
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: { 
        height: getHp(50),
        flexDirection: "row",
        alignItems: "center",
        marginTop: getHp(16)
    },
    commonMargin: {
        marginLeft: getWp(30)
    },
    headerHeadingText: {
        fontSize: FONTSIZE.Text18,
        fontWeight: "bold",
        color: '#000',
        marginLeft: getWp(25)
    }
});