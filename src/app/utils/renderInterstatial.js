
import { Ads } from '@classes';
import Store from '../../store';
import { changeAdsLoaderState } from '../../store/actions'
const renderInterstatial = ( callBackFunc = () => {}, type) => {
    //console.log('TESTHERE_FOR_STATE - ', Store?.getState()?.auth.userCol?.permissions?.showAds);
    if (!Store?.getState()?.auth.userCol?.permissions?.showAds) {
        console.log('User account : Dont need to show ad');
        return callBackFunc();
    }
    if (Store?.getState().adsUsage[type] == true) {
        console.log('adsUsage type false');
        return callBackFunc();
    }

    console.log('rendering AdsLoader');
    Store.dispatch(changeAdsLoaderState(undefined, true));
    
    let ads = new Ads();
    ads.setOnAdsClose(() => { 
        Store.dispatch(changeAdsLoaderState(type, false));
        setTimeout(()=>{
            return callBackFunc();
        }, 500); 
    });
};


export default renderInterstatial;