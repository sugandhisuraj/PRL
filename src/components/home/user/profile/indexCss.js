
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
    headingCommonContainerStyle: {
        marginTop: getHp(30),
        alignItems: 'flex-start',
        paddingHorizontal: getWp(25),
        justifyContent:'space-between',
        flexDirection: 'row'
    },
    headingPlayerProfileContainer: {

        backgroundColor: '#0B214D'
    },
    playerProfileContainer: {
        marginTop: getHp(20),
        width: '90%',
        alignSelf: 'center'
    },
    imageVideoPlaceHolderContainer: {
        marginVertical: getHp(25),
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    photoContainer: {
        width: 140,
        height: 90
    },
    photoLabelContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelTextStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize:FONTSIZE.Text18,
        marginBottom: getHp(20)
    },
    profileContainer: {
        marginLeft: getWp(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userEmailTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: '#000'
    },
    userIdTextStyle: {
        fontSize:FONTSIZE.Text14,
        marginTop: 2,
        color: '#949AB1'
    },
    profileInfoContainer: {
        marginLeft: getHp(10)
    },
    profileImgContainer: {
        height: getHp(46),
        width: getHp(46),
        backgroundColor: '#DCE4F9',
        borderRadius: getHp(100)
    },
    bottomButtonsTray: {
        flexDirection : "row",
        marginTop: getHp(10),
        marginBottom: getHp(30),
        justifyContent: "center",
        alignSelf: 'center',
        width: '80%',
        alignItems: 'center'
    },
    editActiveModePlate:{
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        width: '100%'
    },
    noSignupEventText: {
        alignSelf: 'center',
        marginTop: getHp(50),
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: 'black'
    }
});





