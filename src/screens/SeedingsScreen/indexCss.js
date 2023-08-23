
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#E5E5E5",
        minHeight: '100%',
        // borderWidth:1,
        // borderColor: 'red'
    },
    headerContainer: {
        marginTop: getHp(20),
        width: "85%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    seddingsTextStyle: {
        fontWeight: '400',
        fontSize: FONTSIZE.Text18,
        marginLeft: getWp(20),
        color: 'black'
    },
    eventPlateContainer: {
        marginTop: getHp(30),
        backgroundColor: 'white',
        minHeight: getHp(100),
        width: '90%',
        alignSelf: 'center',
        borderRadius: getHp(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: getWp(15),
        paddingVertical: getHp(20),

        shadowColor: '#DCE4F9',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 2,
    },
    eventListData: {
        paddingVertical: getHp(8),
        //marginVertical: getHp(10),
        borderBottomWidth: .5,
        borderBottomColor: 'grey',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: getWp(20)
    },
    listEventNameText: {
        fontSize: FONTSIZE.Text16,
        fontWeight: '400',
        marginLeft: getWp(20),
        color: 'black'
    },
    listEventImgStyle: {
        height: getHp(50),
        width: getHp(50),
        borderRadius: getHp(50)
    },
    eventListAbsoluteContainer: {
        backgroundColor: 'white', position: 'absolute',
        top: getHp(175),
        width: '89%',
        alignSelf: 'center',
        minHeight: 250,
    },
    selectedEventTextStyle: {
        fontWeight: '700',
        fontSize: FONTSIZE.Text18,
        color: 'black'
    },
    totalPlayerTextStyle: {
        color: 'black',
        marginTop: getHp(10)
    },
    contestBracketTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getHp(40),
        width: '90%',
        alignSelf: 'center'
    },
    commonheadingStyle: {
        color: 'black',
        fontWeight: '700',
        fontSize: FONTSIZE.Text16
    },
    numOfPerContainer: {
        alignSelf: 'center',
        marginTop: getHp(30),
        flexDirection: 'row',
    },
    numOfPerText: {
        fontSize: FONTSIZE.Text16,
        marginTop: getHp(10),
        color: 'black',
        fontWeight: '700'
    },
    inputContainerStyle: {
        height: getHp(40),
        marginLeft: getHp(20),
        width: getWp(60)
    },
    noEventAvailContainer: {
        marginTop: getHp(60),
        alignSelf: 'center'
    },
    noEventAvailTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: '700',
        color: 'black'
    }
});