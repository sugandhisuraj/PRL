
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFF", 
        maxHeight: '90%'
    },
    headerContainer: {
        marginTop: getHp(20),
        width: "85%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    filterContainer: {
        marginTop: getHp(15),
        alignSelf: "center",
        width: "85%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    filterTextStyle: {
        fontSize: FONTSIZE.Text18,
        lineHeight: 22,
        fontWeight: "bold",
        color: "#000",
        alignSelf: 'flex-start',
        marginTop: getHp(10)
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
        color: "#FFF",
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
        width: "90%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
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
        width: "45%",
        marginLeft: getWp(20)
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
        marginTop: getHp(20)
    },
    fromDatePickerContainer: {
        marginTop: getHp(30)
    },
    backTouchContainer: {
        marginTop: getHp(140),
        flexDirection: 'row',
        justifyContent: 'space-between'

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
    dateLabelStyle: {
        marginTop: getHp(30),
        fontSize: FONTSIZE.Text17,
        fontWeight: 'bold',
        color: 'white'
    },
    
    touchBtnStyle: {
        backgroundColor: '#EDCF80',
        height: getHp(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getHp(100),
    },
    profileTextStyle: {
        textAlign: 'center',
        paddingHorizontal: getWp(10),
        fontSize: FONTSIZE.Text16,
        color: 'black',
        fontWeight: '700'
    },
    crearTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'white'
    },
    touchFilterStyle: {
        borderRadius: 100,
        backgroundColor: '#0B214D',
        paddingVertical: getHp(5),
        paddingRight: getWp(10),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getHp(10),
        marginLeft: getWp(5)
    },
    closeIconStyle: {
        fontSize: FONTSIZE.Text15,
        marginLeft: getWp(5)
    }
});