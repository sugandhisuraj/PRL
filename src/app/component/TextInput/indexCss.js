
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    inputViewContainerStyle: {
         shadowColor: '#DCE4F9',
         shadowOffset: {width: 0, height: 2},
         shadowRadius: 10,
         shadowOpacity: 1,
         elevation:2,
         borderRadius: getWp(10),
         backgroundColor: '#FFF',
         justifyContent: 'center',
         height: getHp(55),
         marginBottom: getHp(5) 
    },
    inputStyle: {
        height: getHp(55),
        fontSize: FONTSIZE.Text16,
        //minHeight: 0
    },
    textInputStyle: {
        height: getHp(55),
        // borderRadius: getWp(10),
        // borderWidth: .3,
        // borderColor: "#000",
        paddingHorizontal: getHp(20),
        alignItems: "center",
        color: 'black',
        fontSize: FONTSIZE.Text16
    },
    disabledViewTextStyle: {
        paddingLeft: getWp(15),
        color: 'black'
    }
});