import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "100%",
        //minHeight: getHp(38),
        borderRadius: getWp(25),
        backgroundColor: "white",
        marginTop: getWp(20),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: getWp(20),
        borderWidth: .3,
        borderColor: '#000'
    },

    dropdownContainer: {
        // width: getWp(190),
        // minHeight: getWp(30),
        backgroundColor: "white",
        borderBottomWidth: 0,
        alignItems: 'flex-start',
        justifyContent: 'center', 
    },

    dropdownSelectedText: {
        fontSize: FONTSIZE.Text16,
        color: "black", 
        //paddingLeft: getWp(12),
    },

    dropdown: {
        marginLeft: getWp(-10),
        //width: "95%",
        height: 'auto',
        borderTopWidth: 0,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        backgroundColor: "white",
        maxHeight: getHp(200),
        marginTop: getHp(8)
    },

    dropdownItemContainer: {
        flex: 1,
        //height: getHp(38),
        justifyContent: 'center',
        borderWidth: 0,
        paddingLeft: getWp(12),
        paddingRight: getWp(12),
        paddingVertical: getHp(10),
        marginVertical: getHp(5)
    },

    dropdownText: { 
        color: "black",
        fontSize: FONTSIZE.Text14,
    },

})