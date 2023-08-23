import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        //minHeight: getHp(38),
        //borderRadius: getWp(25),
        backgroundColor: "#0B214D",
        marginTop: getWp(20),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: getWp(20),
        borderWidth: 1,
        borderColor: '#FFF'
    },

    dropdownContainer: {
        // width: getWp(190),
        // minHeight: getWp(30),
        backgroundColor: "#0B214D",
        borderBottomWidth: 0,
        alignItems: 'flex-start',
        justifyContent: 'center', 
    },

    dropdownSelectedText: {
        fontSize: FONTSIZE.Text16,
        color: "white", 
        //paddingLeft: getWp(12),
    },

    dropdown: {
        marginLeft: getWp(-20),
        //width: "95%",
        height: 'auto',
        borderTopWidth: 0,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        backgroundColor: "#0B214D",
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
        color: "white",
        fontSize: FONTSIZE.Text14,
    },
    labelTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: 'white'
    },
    arrowStyle: {
        fontSize: FONTSIZE.Text24,
        color: 'white',
    }
})