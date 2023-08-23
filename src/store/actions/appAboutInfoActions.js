import { getAppInfoData } from '../api';

export const LOAD_APP_INFO = 'LOAD_APP_INFO';
export const INIT_FCM = 'INIT_FCM';

export const fetchAppAboutInfo = () => {
    return {
        type: LOAD_APP_INFO,
        payload: getAppInfoData()
    }
}
export const initFcm = (token = '', ins) => {
    return {
        type: INIT_FCM,
        payload: {
            fcmToken: token,
            fcmIns: ins
        }
    }
}