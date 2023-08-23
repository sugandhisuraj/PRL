//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    rootContainer: {
        flexDirection: "row", 
        width: "85%",
        alignSelf: "center"
    },
    rightContainer: {
        marginLeft: getWp(20),
        width: '75%'
    },
    eventNameStyle: {
        fontWeight: 'bold',
        fontSize: FONTSIZE.Text18,
        color: 'black'
    },
    dateStyle: {
        fontSize: FONTSIZE.Text16,
        color: 'black'
    },
    charityTextStyle: {
        fontSize: FONTSIZE.Text18,
        color: 'black',
        fontWeight: 'bold',
        marginTop: getHp(10)
    }
});