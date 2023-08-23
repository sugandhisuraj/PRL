import { CHANGE_ADS_LOADER_STATE } from '../actions';

const initialState =  {
    firstPlayerProfileList: false,
    firstTimeAllMyGames: false,
    firstTimePickWiners: false,
    loader: false
}

const adsUsageReducer = (state = initialState, action) => {

    switch(action.type) {
        case CHANGE_ADS_LOADER_STATE: 
            let isTypeAvail = action.payload != undefined;
            return {
                ...state,
                loader: action.loaderState,
                [action.payload]: isTypeAvail ? true : state[action.payload]
            }
        default: return state;
    }
} 

export default adsUsageReducer;