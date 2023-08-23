import * as api from '../api';

export const registerUser = (values) => ({
    type:'REGISTER_USER',
    payload: values
})

export const login = (values) => ({
    type:'LOGIN_USER',
    //payload: api.login(values),
    payload: values
});
export const updateUserColData = (values) => ({
    type:'UPDATE_USER_COL', 
    payload: values
})

export const writeProfile = (values) => ({
    type:'USER_PROFILE_WRITE',
    payload: api.writeProfileInformation(values)
})

export const readProfile = (userId) => ({
    type:'USER_PROFILE_READ',
    payload: api.readProfileInformation(userId)
})

export const readEvents = () => ({
    type:'EVENTS_READ',
    payload: api.getAllEvents()
});

export const readCharities = async () => ({
    type:'CHARITIES_READ',
    payload: await api.getAllCharities()
});

export const createdNewProfile = (payload) => {
    return {
        type: 'USER_PROFILE_CREATED',
        payload
    }
} 