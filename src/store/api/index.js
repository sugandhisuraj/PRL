import {
    eventsCollection,
    firebase,
    usersCollection,
    charitiesCollection,
    prlAboutTermsPrivacyCollection
} from '../../firebase';
import { transformFirebaseValues } from '@utils';
import { Platform } from 'react-native';
import { UserModel } from '@models';
export const registerUser = async ({
    email,
    password, 
    userName = '',
    userNickname = '',
    userCellPhone = '',
    userAvatar = '',
    fcmToken = ''
}) => {
    try {
        console.log('FCM_WHILE_CREATE - ', fcmToken);
        const response = await firebase.auth()
            .createUserWithEmailAndPassword(email, password);
        const { user } = response;
        console.log('RESPONSE_CREATE_USER_WITH_EMAIL - ', JSON.stringify(response))
        const userModel = new UserModel({
            uid: user.uid,
            email,
            userAvatar,
            userCellPhone,
            userName,
            userNickname,   
            fcmToken,   
        }); 
        
        const saveUser = await userModel.save();
        console.log('USER_SAVE_RESP - ', JSON.stringify(saveUser));
        return saveUser;
    } catch (error) {
        console.log('ERROR_WHILE_CREATE_USER - ', error);
        return Promise.reject(error);
    }
}

export const login = async ({ email, password }) => {
    try {
        const response = await firebase.auth().signInWithEmailAndPassword(email, password);
        const { user } = response;
        return { user }
    } catch (error) {
        console.log('ERROR_HERE - ', error);
        return Promise.reject(error);

    }
}

export const writeProfileInformation = async ({ userId, name, nickName, eventName, charity }) => {

    const response = await usersCollection.doc(userId).set({
        name,
        nickName,
        eventName,
        charity
    });
    return response;
}

export const readProfileInformation = async (userId) => {

    const response = await usersCollection.doc(userId).get()
    console.log(userId);
    return response.data()
}

export const getAllEvents = async () => {
    const response = await eventsCollection.get();
    return response;
}
export const getAllCharities = async () => {
    const response = await charitiesCollection.get();
    return response;
}
export const getAppInfoData = async () => {
    const response = await prlAboutTermsPrivacyCollection.get();
    const transResponse = transformFirebaseValues(response);
    //console.log('GET_APP_INFO_DATA - ', transResponse[0]);
    return transResponse[0];
}