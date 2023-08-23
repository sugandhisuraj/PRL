
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    childContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: 'white'
    },
    oContainer: {
        marginTop: getHp(8),
        marginLeft: getHp(20)
    },
    scrollOContainer: {
        marginTop: getHp(8),
        marginLeft: getHp(20),
        maxHeight: getHp(200), 
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        borderWidth:1,
        borderColor: 'white'
    },
    optionItemTextStyle: {
        fontSize: FONTSIZE.Text16,
        color: 'white',
        marginLeft: getHp(20),
        paddingVertical: getHp(10)
    },
    checkboxStyle: {
        width: getHp(15),
        height: getHp(15),
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: getHp(30)
    },
    checkBoxFillStyle: {
        backgroundColor: 'white',
    },
    iconStyle: {
        fontWeight: 'bold',
        fontSize: FONTSIZE.Text20,
        color: 'white'
    },
    collapseViewStyle: {
        maxHeight: getHp(300),
        marginTop: getHp(15),  
    },
    someMargin: {
        marginTop: getHp(25)
    },
    selectedOptionStyle: {
        backgroundColor:'white'
    },
    selectedOptionTextStyle: {
        color: 'black'
    },
    collapseScrollContainer: {
        height: getHp(100)
    }
});