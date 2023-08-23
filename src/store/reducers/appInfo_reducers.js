import {
    LOAD_APP_INFO,
    INIT_FCM
} from '../actions';

const initialState = {
    appInfoData: {},
    fcmToken: '',
    isFcmGenerated:false,
    fcmIns: null
}

export const AppInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_APP_INFO: 
        return {
            ...state,
            appInfoData: action.payload
        }
        case INIT_FCM: 
        return {
            ...state,
            fcmToken: action.payload.fcmToken,
            fcmIns: action.payload.fcmIns,
            isFcmGenerated: true,
        }
        default: return state;
    }
};