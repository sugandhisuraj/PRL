import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({ 
    containerStyle: {
        flexDirection: 'row',
        marginTop: getHp(10),
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: getHp(80),
        alignItems: 'center'
    },
    circleView: {
        width: getHp(8),
        height: getHp(8),
        borderRadius: getHp(20),
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    selectedCircleView: {
        width: getHp(15),
        height: getHp(15),
        borderRadius: getHp(30),
        backgroundColor: '#0B214D'
    }
});