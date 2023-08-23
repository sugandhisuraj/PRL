 
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    childViewStyle:{
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
        marginTop: getHp(60)
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
        marginTop: getHp(20)
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
    },
    termsConditionContainer:{
        marginTop: getHp(35),
        width: '95%',
        alignSelf: 'center', 
        flexDirection: 'row'
    },
    privacyPolicyStyle: {
        fontSize: FONTSIZE.Text15,
        fontWeight: '600',
        color: 'black',
        marginLeft: getWp(30),
        lineHeight: getHp(22),
        marginTop: -getWp(4),
         
    },
    termsConditionSubContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    privactyTouchTextStyle: { 
        top: getWp(4.5),
        fontSize: FONTSIZE.Text15,
        fontWeight: '600',
        color: '#4FC4F6',
     }
});