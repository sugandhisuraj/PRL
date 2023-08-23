import React from 'react';
import { View } from 'react-native';
import {
    AdMobBanner
} from 'expo-ads-admob';  
import {
    APP_CONFIGURATIONS
} from '@constants';
const useAdsBanner = (auth) => { 
    let renderBanner = auth?.userCol?.permissions?.showAds || false;
    const BannerAdsComponent = () => {
        if (!renderBanner) {
            return null;
        }
        return (
            <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                <AdMobBanner
                    style={{ minWidth: 250 }}
                    bannerSize="banner"
                    adUnitID={APP_CONFIGURATIONS.ADMOB.testBanner}
                    servePersonalizedAds// true or false
                    onDidFailToReceiveAdWithError={(e) => console.log("Error ---> ", e)}
                />
            </View>
        );
    }

    return [
        renderBanner,
        BannerAdsComponent
    ];
}

export default useAdsBanner;