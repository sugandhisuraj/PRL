import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview';
import {
    prlAboutTermsPrivacyCollection
} from '../../firebase';
import { transformFirebaseValues } from '@utils';


export default function TermsConditions() {
    const [termsArray, setTermsArray] = useState(null)
    const loadProfileData = async () => {
        const termsData = await prlAboutTermsPrivacyCollection.get();
        let termsConverted = transformFirebaseValues(termsData, 'charityID')
        // console.log("privacy",privacyConverted[0].htmlPrivacyPolicy);
        setTermsArray(termsConverted[0].htmlTermsOfUse)

    }

    useEffect(() => {
        loadProfileData();

    }, [])
    return (
        <View style={{ flex: 1 }}>
            <WebView
                originWhitelist={['*']}
                source={{ html: termsArray }}
            />
        </View>
    )
}
