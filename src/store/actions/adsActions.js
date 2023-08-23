export const CHANGE_ADS_LOADER_STATE = 'CHANGE_ADS_LOADER_STATE';

export const changeAdsLoaderState = (adsType = undefined, loaderState) => {
    return {
        type: CHANGE_ADS_LOADER_STATE, 
        payload: adsType,
        loaderState
    }
}