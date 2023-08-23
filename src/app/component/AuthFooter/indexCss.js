
//External Imports
import { StyleSheet, Platform } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    footerContainer: {
        position: 'absolute',
        bottom: Platform.OS == "android" ? getHp(10) : getHp(25),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        width: "75%"
    },
    titleTextStyle: {
        color: '#949AB1',
        fontSize: FONTSIZE.Text12
    },
    contentTouchContainer: {
        borderBottomWidth: .5,
        borderBottomColor: '#949AB1'
    }
});