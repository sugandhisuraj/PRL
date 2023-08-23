import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({ 
    mainContainer: {
        height: getHp(50),
        width: '100%',
        backgroundColor: '#0B214D',
        justifyContent: 'center',
        alignItems: 'center', 
         
    },
    container: { 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headingTextStyle: {
        color: 'white',
        fontWeight: '700',
        fontSize: FONTSIZE.Text18
    },
    upDownIconStyle: {
        color: 'white',
        fontSize: FONTSIZE.Text20,
        fontWeight: 'bold',
        marginLeft:getWp(20)
    },
    collapseStyle: {
        marginTop: getHp(15),
    }

})