
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    modalStyle: { 
        height: hp(100),
        width: wp(100),
        margin: 0,
        borderWidth:1,
        borderColor: 'red'
    },
    filterContainerStyle: { 
        minHeight: hp(100),
        minWidth: wp(70),
        position: 'absolute',
        right: 0,
        backgroundColor: '#0B214D', 
    }
});