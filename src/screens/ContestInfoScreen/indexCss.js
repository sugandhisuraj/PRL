
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
        marginTop: getHp(15), 
    },
    eventDetailsContainer: { 
        alignSelf: "center"
    },
    eventDescriptionTextStyle: {
        marginTop: getHp(20),
        height: getHp(100),
        borderWidth: 0,
        width: wp(90),
        alignSelf: "center"
    
    },
    bottomTrayContainer: { 
        marginTop: getHp(20),
        width: "90%",
        alignSelf: "center"
    },
    uploadVideoContainerStyle: {
        marginTop: getHp(15),
        marginLeft: getWp(25),
        // height: getHp(70),
        // width: getWp(112)
    },
    bottomButtonsTray: {
        flexDirection : "row",
        marginTop: getHp(40),
        justifyContent: "space-between", 
        alignSelf: "center",
        marginBottom: getHp(40),
        width: '70%'
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
    maxNumplayersStyle: {
        height: getHp(40),
        marginTop: getHp(18)
    },
    maxNumplayersTextStyle: {
        height: getHp(40)
    },
    selectContestTypeHeadingContainer: {
        marginTop: getHp(15), 
        height: 35
    },
    selectBracketTypeScoringContainer: {
        // marginTop: getHp(25),
        height: 35,
        justifyContent: 'center'
    },
    galleryView: {
        alignSelf: 'center',
        flexDirection: "row",
        marginTop: getHp(10)
    },
    galleryTextStyle: {
        fontSize: FONTSIZE.Text18,
        fontWeight: "700",
        color: 'black'
    },
    uploadPhotoContainerStyle: {
        width: getWp(214),
        height: getHp(134)
    },
    nextContainer: {
        marginVertical: getHp(20), 
    },
    nextContainerRow:{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    }
});





