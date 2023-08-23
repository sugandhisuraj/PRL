import {
    READY_FIREBASE_DATA,
    READY_FIREBASE_DATA_ERROR,
    UPDATE_FIREBASE_DATA_EVENTS
} from '../actions/';

const initialState = {
    firebaseCollectionData: {},
    isReady: false,
    loading: true,
    error: false,
    errorInfo: null
};

export const firebaseCollectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case READY_FIREBASE_DATA:
            return {
                ...state,
                firebaseCollectionData: action.payload,
                isReady: true,
                loading: false,
                error: false,
                errorInfo: null
            };
        case READY_FIREBASE_DATA_ERROR:
            return {
                ...state,
                firebaseCollectionData: {},
                isReady: true,
                loading: false,
                error: true,
                errorInfo: action.payload
            };
        case UPDATE_FIREBASE_DATA_EVENTS: 
            return {
                ...state,
                firebaseCollectionData: action.payload
            }
        default: return state;
    }
}
