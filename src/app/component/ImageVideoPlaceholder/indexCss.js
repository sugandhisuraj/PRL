
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        height: getHp(90),
        width: getHp(90),
        backgroundColor: "#C4C4C4",
        justifyContent: "center", 
        alignItems: "center",
        paddingHorizontal: getHp(10)
    },
    textStyle: {
        alignSelf: "center",
        fontSize: FONTSIZE.Text16,
        color: "#000000",
        textAlign: 'center'
    },
    imageStyle: {
        height: getHp(90),
        width: getHp(90)
    },
    modalContainer: {
        flex:1,
        height: '100%',
        width: '100%',
        // borderWidth:1,
        // borderColor: "red", 
        justifyContent: "center",
        alignItems: "center"
    },
    renderModalImage: { 
        height: hp(90),
        width: wp(90),
        resizeMode: 'contain',
        borderRadius: 0
    },
    closeContainer: {
        position: 'absolute',
        right: getWp(10),
        top: getHp(10),
        zIndex: 10, 
        borderWidth:1,
        borderColor: 'red',
        borderRadius:20,
        padding: getHp(4),
        backgroundColor: 'red'
    },
    backgroundVideo: {
        height: hp(70),
        width: wp(85),
        backgroundColor: 'transparent'
      },
      deleteIconView: {
        position: 'absolute',
        left: getWp(10),
        top: getHp(10),
        zIndex: 10,
        color: "black",
        borderWidth:1,
        borderColor: 'red',
        borderRadius:20,
        padding: getHp(4),
        backgroundColor: 'red'
      }
});