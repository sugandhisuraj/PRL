
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    headingContainerStyle: {
        width: "100%",
        backgroundColor: "#0B214D",
        justifyContent: "center",
        //alignItems: "center",
        paddingVertical: getHp(8),
        paddingHorizontal: getWp(20)
    },
    headingTextStyle: {
        fontWeight: '700',
        fontSize: FONTSIZE.Text16,
        color: "white"
    },
    textInputStyle: {
        marginTop: 10,
        minHeight: (70),
        marginLeft: getWp(15),
        borderWidth: 0,
        width: wp(90),
        alignSelf: "center",
        fontSize: FONTSIZE.Text16
    },
    textAreaInputDisabledStyle: {
        marginTop: 10,
        minHeight: (70),
        marginLeft: getWp(15),
        borderWidth: 0,
        width: wp(90),
        alignSelf: "center",
        fontSize: FONTSIZE.Text16
    },
    container: {
        //marginBottom: getHp(10)
    },
    borderAndShadowStyle: {
        shadowColor: '#DCE4F9',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 2,
        borderRadius: getWp(10),
        backgroundColor: '#FFF',
        justifyContent: 'center',
        width: wp(90),
        alignSelf: 'center',
        // height: getHp(55),
        marginVertical: 15
    }

});


