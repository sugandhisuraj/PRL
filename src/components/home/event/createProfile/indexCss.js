
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { color } from 'react-native-reanimated'; 

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
        flexDirection: "row"
    },
    imagePlateRightChildView: {
        //borderWidth:1,
        borderColor: "red",
        width: "70%",

    },
    datePickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    singleHeadingContainer: {
        marginTop: getHp(15),
    },
    eventDetailsContainer: {
        alignSelf: "center"
    },
    eventDescriptionTextStyle: {
        marginTop: getHp(10),
        height: getHp(55),
        borderWidth: 0,
        width: wp(90),
        alignSelf: "center",
        color: "black"
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
        flexDirection: "row",
        marginTop: getHp(30), 
        alignSelf: "center", 
        alignItems: 'center'
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
        height: getHp(45),
        marginTop: getHp(5)
    },
    maxNumplayersTextStyle: {
        height: getHp(45)
    },
    selectContestTypeHeadingContainer: {
        marginTop: getHp(15),
        height: getHp(35)
    },
    selectBracketTypeScoringContainer: {
        height: getHp(35)
    },
    galleryView: {
        flexDirection: "row",
        marginTop: getHp(10)
    },
    galleryTextStyle: {
        fontSize: FONTSIZE.Text18,
        fontWeight: "700"
    },
    uploadPhotoContainerStyle: {
        width: getWp(214),
        height: getHp(134)
    },
    staticEventImageContainerStyle: {
        marginTop: getHp(40)
    },
    tripleHeadingContainer: {
        marginTop: getHp(25)
    },
    createProfileContainer: {
        marginTop: getHp(90)
    },
    questionsInputContainer: {
        marginTop: getHp(25),
        alignSelf: "center",
        width: "90%"
    },
    questionInputCommonTextStyle: {
        //marginTop: getHp(15)
    },
    questionLabelStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'black',
        marginVertical: getHp(20)
    },
    skipContainerStyle: {
        alignSelf:'center',
        marginTop: getHp(20),
        width: getWp(100),
    }
});





