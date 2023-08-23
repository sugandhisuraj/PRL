import React,{useEffect,useState} from 'react' 
import {View} from 'react-native'
import { WebView } from 'react-native-webview';
import { 
    prlAboutTermsPrivacyCollection
  } from '../../firebase';
  import { transformFirebaseValues } from '@utils';
export default function PrivacyPolicy() {

    const [privacyArray,setPrivacyArray]=useState(null)
    const loadProfileData = async () => {
        console.log(true,privacyArray==null)

        const privacyData = await prlAboutTermsPrivacyCollection.get();
        // console.log("privacyData",privacyData);
       let privacyConverted = transformFirebaseValues(privacyData,'charityID')
        // console.log("privacy",privacyConverted[0].htmlPrivacyPolicy);
      setPrivacyArray(privacyConverted[0].htmlPrivacyPolicy)
     
 }
 
 useEffect(() => {
     loadProfileData();
    
 }, [])
    return (
        <View style={{flex:1}}>
                       <WebView
                        originWhitelist={['*']}
                        source={{ html:privacyArray }}
                    />
             </View>
    )
}
