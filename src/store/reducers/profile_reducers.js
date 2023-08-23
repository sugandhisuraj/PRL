const INITIAL_STATE = {
    profile: {},
    error: null,
    createdUserData: {}
}

export default function (state=INITIAL_STATE, action) {
    switch(action.type) {
        case 'USER_PROFILE_READ':
            return {...state, profile: action.payload };
        case 'USER_PROFILE_CREATED':
            return {...state, createdUserData: action.payload};
        default:
            return state
    }
}