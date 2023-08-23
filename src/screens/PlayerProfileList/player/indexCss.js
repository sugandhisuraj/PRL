 
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    DoneButtonTouch: {
        marginTop: getHp(30),
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
    },
    DoneButtonStyle: {
        paddingVertical: getHp(10),
        fontSize: FONTSIZE.Text17,
        fontWeight: 'bold',
        color: '#0B214D'
    },
    headerContainer: {
        marginTop: getHp(40),
        width: "85%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    filterContainer: {
        marginTop: getHp(30),
        alignSelf: "center",
        width: "85%",
        flexDirection: "row",
        justifyContent: "space-between"

    },
    filterTextStyle: {
        fontSize: FONTSIZE.Text18,
        lineHeight: 22,
        fontWeight: "bold",
        color: "#000",
        //width: '20%'
    },
    filterContentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "80%"
    },
    filterContentTextStyle: {
        fontSize: FONTSIZE.Text17,
        lineHeight: 22,
        color: "#000",
        marginLeft: getWp(15),
    },
    filterContainerStyle: {
        marginTop: getHp(12)
    },
    eventsContainer: {
        marginTop: getHp(25)
    },
    eventsHeadingContainer: {
        backgroundColor: "#0B214D",
        width: "100%",
        height: getHp(35),
        justifyContent: "center"
    },
    eventsHeadingText: {
        color: "#FFFFFF",
        fontSize: FONTSIZE.Text18,
        lineHeight: 22,
        fontWeight: "bold",
        marginLeft: getWp(40)
    },
    eventContainer: {
        width: "100%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2",
        marginVertical: getHp(18),
        paddingBottom: getHp(18)
    },
    eventImgContainer: {
        width: "20%",

    },
    eventImgView: {
        height: getWp(80),
        width: getWp(80),
        backgroundColor: `#C4C4C4`
    },
    eventInfoContainer: {
        width: "60%"
    },
    eventNameText: {
        fontSize: FONTSIZE.Text18,
        color: "#000",
        fontWeight: "bold",
        lineHeight: 22
    },
    numOfGameText: {
        fontSize: FONTSIZE.Text16,
        color: "#000",
        lineHeight: 19,
        marginTop: getHp(10)
    },
    eventCont: {
        marginTop: getHp(25)
    },
    sidebarContainer: {
        height: '100%',
        width: '85%',
        alignSelf: 'center',   
    },
    closeModalStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONTSIZE.Text20,
    },
    containerCategoryStyle: {
         marginTop: getHp(25)
    },
    genreDropDownContainer: {
        marginTop: getHp(35)
    },
    fromDatePickerContainer: {
        marginTop: getHp(30)
    },
    backTouchContainer: {
        marginTop: getHp(0)
    },
    dateLabelStyle: {
        marginTop:getHp(30),
        fontSize: FONTSIZE.Text17,
        fontWeight: 'bold',
        color: 'white'
    },
    createFilterTextStyle: {
        color: 'white',
        fontSize: FONTSIZE.Text16,
        fontWeight: '700'
    },
    clearContainer: {   
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: getHp(50),
        alignItems: 'center'
    }
});