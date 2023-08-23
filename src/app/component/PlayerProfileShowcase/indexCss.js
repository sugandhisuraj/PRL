
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getHp(20),
        width: '93%',
        alignSelf: 'center',
        minHeight: getHp(170)
    },
    leftRightIconStyle: {
        fontSize: FONTSIZE.Text28,
        color: '#0B214D'
    },
    showCaseContainer: {
        width: '80%',
        // borderWidth:1,
        // borderColor: "blue",
        justifyContent: 'center',
        alignItems:'center'
    },
    leftRightTouchStyle: {
        width: '10%',
        // borderWidth:1,
        // borderColor: 'red'
    },
    nameStyle: {
        color: 'black',
        fontWeight: '700',
        fontSize: FONTSIZE.Text18
    },
    commonMarginStyle: { 
        marginTop: getHp(8)
    }, 
    eventNameStyle: {
        color: 'black',
        fontWeight: '700',
        fontSize: FONTSIZE.Text14,
        marginTop: getHp(15)
    }
});