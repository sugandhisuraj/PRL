
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    childViewStyle: {
        backgroundColor: "#fff",
        flex:1, 
    },
    container: {
        backgroundColor: "#fff",
        flex:1,
    },  
    bottomButtonsTray: {
        flexDirection : "row",
        marginTop: getHp(30),
        justifyContent: "space-between",
        alignSelf: 'center', 
    },
    createContestTypesContainer: {
        alignSelf: 'center',
        marginTop: getHp(20)     
    },
    orTextStyle: {
        marginVertical: getHp(20),
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: FONTSIZE.Text16,
        color: 'black'
    },
    customContestTyle: {
        width: getWp(323)
    },
    nextContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: getHp(50), 
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedContestContainer: {
        marginVertical: getHp(20), 
        // borderWidth:1,
        // borderColor:'red'
    },
    selectedContestRow: {
        marginVertical: getHp(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectedContestTextStyle: {
        fontSize: FONTSIZE.Text14,
        color: 'black',
        marginLeft: getWp(15)
    }
});





