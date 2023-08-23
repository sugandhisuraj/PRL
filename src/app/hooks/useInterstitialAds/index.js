import { useEffect, useCallback } from 'react'; 

const useInterstitialAds = () => {

    let renderInterstatial = useCallback(()=>{
        if (!auth.userCol?.permissions?.showAds) {
            return navigation.navigate('CharityStack', { screen: 'ViewCharityScreen' });
          }
          setLoader(true);
          let ads = new Ads();
          ads.setOnAdsClose(() => {
            setLoader(false);
            setTimeout(() => {
              navigation.navigate('CharityStack', { screen: 'ViewCharityScreen' })
            }, 500);
          });
    }, [])
    useEffect(()=>{
        (async () => {
            AdMobInterstitial.removeAllListeners();
            await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
            await AdMobInterstitial.showAdAsync();
           
            AdMobInterstitial.addEventListener("interstitialDidClose", () => {
                //your stuff after ad is closed
                console.log('ADD IS CLOSED = ');
              });
        })();

        return () => {}
    }, []);
}

export default useInterstitialAds;