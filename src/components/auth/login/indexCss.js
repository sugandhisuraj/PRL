
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    CheckboxStyle: {
        borderRadius: 30,
        borderColor: 'black',
        borderWidth: 1,
        color: 'black'
    },
    label: {
        color: 'black',
        right: 12,
        fontSize: FONTSIZE.Text15,
        top: -1.5
    },
    checkboxContainer: {
        marginTop: getHp(10),
        paddingVertical: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    childViewStyle: {
        backgroundColor: '#FFF',
        flexDirection: "column",
        justifyContent: "space-between"
    },
    container: {
        //flex:1,
        //height: "100%",
        backgroundColor: "#fff",

    },
    imageBoxContainer: {
        alignSelf: "center",
        marginTop: getHp(120),
        height: getHp(180),
        width: getHp(180)
    },
    logoStyle: {
        height: getHp(180),
        width: getHp(180)
    },
    formContainer: {
        marginTop: getHp(30),
        width: "80%",
        alignSelf: "center"
    },
    formHeadingText: {
        fontSize: FONTSIZE.Text18,
        fontWeight: "bold",
        color: "#000"
    },
    inputContainerStyle: {
        marginTop: getHp(20),
    },
    renderExtrasContainer: {
        marginTop: getHp(20),
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    renderExtrasHeading: {
        fontSize: FONTSIZE.Text16,
        color: '#000'
    },
    clickHereText: {
        color: '#EC2939',
        fontSize: FONTSIZE.Text16,
    },
    errorContainer: {
        marginTop: getHp(10),
        marginLeft: getWp(20)
    },
    errorTextStyle: {
        fontSize: FONTSIZE.Text15,
        color: "red"
    }
});