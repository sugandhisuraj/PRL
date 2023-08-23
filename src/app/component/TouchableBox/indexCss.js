//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';

export default StyleSheet.create({
    CustomBoxView: {
        height: 84,
        width: 150,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
      },
    
      CustomBoxBGImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
        position: 'absolute',
        alignSelf: 'center',
        opacity: 1
      },
    
      CustomBoxText: {
        fontSize: 18,
        lineHeight: 22,
        color: '#FFF'
      },
});