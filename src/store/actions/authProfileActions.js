import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseOperations } from '@classes';

export const AUTO_LOGIN_ACT = 'AUTO_LOGIN_ACT';

export const tryAutoLoginAction = async () => {
    try {
        const savedUserData = await AsyncStorage.getItem('userInfo');
        if (savedUserData) {
            let savedUser = JSON.parse(savedUserData);
            console.log('EXPIRATION_TEST ', savedUser.user.stsTokenManager.expirationTime);
            if (new Date().getTime() > savedUser.user.stsTokenManager.expirationTime) {
                //FirebaseOperations.unlinkFcm(savedUser.user.uid);
                return {
                    type: AUTO_LOGIN_ACT,
                    payload: { autoLogin: true }
                }
            }
            return {
                type: AUTO_LOGIN_ACT,
                payload: {
                    userId: savedUser.user.uid,
                    isAuth: true,
                    user: savedUser.user,
                    userCol: savedUser.userCol,
                    autoLogin: true
                }
            }
        } else {
            return {
                type: AUTO_LOGIN_ACT,
                payload: { autoLogin: true }
            }
        }

    } catch (error) {
        console.log('ERROR_TRY_AUTO_LOGIN ', error);
        return {
            type: AUTO_LOGIN_ACT,
            payload: { autoLogin: true }
        }
    }
}

