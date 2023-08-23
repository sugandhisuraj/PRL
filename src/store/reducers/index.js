import { combineReducers } from 'redux';
import auth from './auth_reducers';
import profile from './profile_reducers';
import event from './event_reducers'
import {CharitiesReducer} from './charities_reducers';
import { AppInfoReducer } from './appInfo_reducers'; 
import { firebaseCollectionReducer } from './firebase_collection_reducers';
import adsUsageReducer from './ads_reducers';

const rootReducer = combineReducers({
    auth,
    profile,
    event,
    charities: CharitiesReducer,
    appInfoData: AppInfoReducer,
    firebaseAllCollectionData:firebaseCollectionReducer,
    adsUsage: adsUsageReducer
});

export default rootReducer;