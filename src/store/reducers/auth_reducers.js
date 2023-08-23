import { AUTO_LOGIN_ACT } from '../actions';

const INITIAL_STATE = {
    user: {},
    userCol: {},
    isAuth: false,
    error: null,
    userId: '',
    autoLogin: false
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'REGISTER_USER':
            return { ...state, user: action.payload, isAuth: true }
        case 'LOGIN_USER':
            return {
                ...state,
                userId: action.payload.user.uid,
                isAuth: true,
                user: action.payload.user,
                userCol: action.payload.userCol
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                user: {},
                userCol: {},
                isAuth: false,
                error: null,
                userId: '',
                autoLogin: true
            }
        case AUTO_LOGIN_ACT:
            return {
                ...state,
                ...action.payload
            }
        case 'UPDATE_USER_COL': {
            return {
                ...state,
                userCol: {
                    ...state.userCol,
                    ...action.payload
                }
            }
        }
        default:
            return state
    }
}