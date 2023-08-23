
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    labelTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: '#FFF',
        width: '30%'
    },
    singleDateStyleContainer: {
        height: getHp(37),
        width: getHp(37),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center', 
    },
    slashTextStyle: {
        fontSize: FONTSIZE.Text24,
        fontWeight:'bold',
        color: 'white',
        marginHorizontal: getWp(20)
    },
    dateTextStyle: {
        fontSize: FONTSIZE.Text16,
        fontWeight: 'bold',
        color: 'black'
    }
});