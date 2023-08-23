
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    childViewStyle: {
        backgroundColor: "#fff",
    },
    container: {
        backgroundColor: "#fff",
    }, 
    inputContainerStyle: {
        width: "80%",
        alignSelf: "center",
        marginTop: getHp(20),
        height: getHp(45),
        // borderWidth:1,
        // borderColor: "red"
    },
    inputStyle: {
        height: getHp(45),
        // borderWidth:1,
        // borderColor: "green"
    },
    imagePlateContainer: {
        width: "85%",
        marginTop: getHp(20),
        alignSelf: "center",
        justifyContent: "space-between",
        flexDirection : "row"
    },
    imagePlateRightChildView: {
        //borderWidth:1,
        borderColor: "red",
        width: "70%",
        
    },
    datePickerContainer: {
        flexDirection :"row",
        justifyContent: "space-between"
    },
    singleHeadingContainer: {
        marginTop: getHp(15)
    },
    eventDetailsContainer: {
        marginTop: getHp(10), 
        alignSelf: "center"
    },
    eventDescriptionTextStyle: {
        marginTop: getHp(20),
        height: getHp(100)
    },
    bottomTrayContainer: {
        flexDirection : "row",
        marginTop: getHp(10),
        alignItems: 'center'
    },
    uploadVideoContainerStyle: {
        marginLeft: getWp(15),
        height: getHp(70),
        width: getWp(112)
    },
    bottomButtonsTray: {
        flexDirection : "row",
        marginTop: getHp(30),
        justifyContent: "space-between",
        alignSelf: 'center',
         
    },
    createContestTypesContainer: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center"
    },
    addContestTypeStyle: {
        marginTop: getHp(25),
        
    },
    addContestTypeIconStyle: {
        fontSize: FONTSIZE.Text25,
        color: "black"
    },
    sideButtonsContainer: {
        marginLeft: getHp(20)
    },
    enterFeesBtnContainer: {
        marginTop: getHp(15)
    },
    createProfileTitleStyle: {
        fontSize: FONTSIZE.Text14
    },
    uploadPicStyle: {
        width: getWp(200),
        height: getHp(104)
    },
    galleryLabelStyle: {
        marginTop: getHp(25),
        fontSize:FONTSIZE.Text18,
        fontWeight: '700',
        color: 'black'

    },
    saveEditBtnStyle: {
        marginTop: getHp(45),
        alignSelf: 'center',
        marginBottom: getHp(30)
    },
    closeEditModelContainer: {
        position: 'absolute',
        right: getWp(15),
        top: getHp(28)
    },
    paymentTermsStyle: {
        marginTop: getHp(40)
    },
    questionsInputContainer: { 
        alignSelf: "center",
        width: "90%"
    },
    questionLabelStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'black',
        marginVertical: getHp(20)
    },
});





