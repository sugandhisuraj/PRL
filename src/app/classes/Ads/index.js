import { Platform } from 'react-native';
import { AdMobInterstitial } from 'expo-ads-admob';
import {APP_CONFIGURATIONS} from '@constants';


class Ads {

    onAdsClose = undefined;
    constructor() {
        (async () => {
            console.log('Ads constructor');
            if (Platform.OS == 'android') {
                AdMobInterstitial.removeAllListeners();
            }
            
            await AdMobInterstitial.setAdUnitID(APP_CONFIGURATIONS.ADMOB.productionInterstatial); 

            console.log('Ads assigning listeners');
            this.assignListeners();

            console.log('Ads request Ad Async');

            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });

            
            await this.triggerInterstitialAds();

        })();
    }
    assignListeners = () => {
        console.log('assign ad listeners');
        AdMobInterstitial.addEventListener("interstitialDidClose", this.interstitialDidClose);
        AdMobInterstitial.addEventListener("interstitialDidFailToLoad", (error) => {
            console.log('Ad failed to load, Error => ', error);
            this.removeInterstitialAdsListener();
            if (this.onAdsClose) {
                this.onAdsClose();
            }
        });
    }
    setOnAdsClose = (onAdsClose) => {
        this.onAdsClose = onAdsClose;
    }
    interstitialDidClose = () => {
        console.log('ADD IS CLOSED = ');
        this.removeInterstitialAdsListener();
        if (this.onAdsClose) {
            this.onAdsClose();
        }
    }
    triggerInterstitialAds = async () => {
        await AdMobInterstitial.showAdAsync();
    }
    removeInterstitialAdsListener = async () => {
        if (Platform.OS == 'android') {
            AdMobInterstitial.removeAllListeners();
        }
    }

}

export default Ads;