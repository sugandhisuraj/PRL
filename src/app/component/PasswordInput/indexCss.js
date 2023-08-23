
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    inputViewContainerStyle: {
        height: getHp(55),
        // borderRadius: getWp(10), 
        // borderWidth: .3,
        // borderColor: "#000",
        paddingLeft: getHp(20),
        paddingRight: getHp(25),
        justifyContent: "center",
        flexDirection: "row",
        
        backgroundColor: 'white',
        shadowColor: '#DCE4F9',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation:2,
        borderRadius: getWp(10),
    },
    inputStyle: {   
        height: getHp(55), 
        fontSize: FONTSIZE.Text16
    },
    eyeStyle: { 
        fontSize: FONTSIZE.Text22,
        alignSelf: "center",
        color: "#000"
    },
    eyeContainer: {
        alignSelf: "center"
    }
});