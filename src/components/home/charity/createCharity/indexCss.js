
//External Imports
import { StyleSheet } from 'react-native';

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    childViewStyle: {
        backgroundColor: "#fff",
    },
    container: {
        backgroundColor: "#fff",
    },
    charityNameTextInputStyle: {
        width: '90%',
        alignSelf: 'center',
        marginTop: getHp(20),
        height: getHp(40)
    },
    charityInfoContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: getHp(20),
        flexDirection: 'row'
    },
    uploadLogoContainerStyle: {
        height: getHp(100),
        width: getHp(100),
        borderRadius: getHp(100)
    }, 
    inputsContainerStyle: {
        marginLeft: getHp(20),
        width: '68%'
    },
    charityUrlInputStyle: { 
        height: getHp(40)
    },
    contactEmailStyle: {
        marginTop: getHp(15),
        height: getHp(40)
    },
    singleHeadingContainer: {
        marginTop: getHp(20)
    },
    charityMissionInputStyle: {
        marginTop: getHp(20)
    },
    descriptionHeadingStyle: {
        marginTop: getHp(20),
        backgroundColor: '#0B214D',
        alignItems: 'flex-start',
        paddingHorizontal: getWp(25)
    },
    charityHeadingContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDCF80'
    },
    uploadPVHeadingStyle: {
        alignItems: 'flex-start',
        paddingHorizontal: getWp(25),
        backgroundColor: '#EC2939'
    },
    uploadPictureVideoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        alignSelf: 'center',
        marginTop: getHp(10)
    },
    uploadPictureStyle: {
        height: getHp(125),
        width: getHp(125),
        borderRadius: getHp(20)
    },
    uploadDocumentContainerStyle: {
        marginTop: getHp(30)
    },
    bottomButtonTrayContainer: {
        marginTop: getHp(30),
        marginBottom: getHp(40),
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    }
});





