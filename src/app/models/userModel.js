import { Platform } from 'react-native';
import { usersCollection } from '@PRLFirebase';
class UserModel {
    uid = '';
    email = '';
    userAvatar = '';
    userCellPhone = '';
    userName = '';
    userNickname = ''
    //userType: 'admin';
    userType = 'user';
    createdAt = new Date();
    fcmToken = ''
    platform = Platform.OS;
    permissions = {
        showAds: false,
        showHostEvents: false,
        showAddCharities: false
    };



    constructor(user) {
        this.uid = user.uid;
        this.email = user.email;
        this.userAvatar = user.userAvatar;
        this.userCellPhone = user.userCellPhone;
        this.userName = user.userName;
        this.userNickname = user.userNickname;
        this.fcmToken = user.fcmToken;
    }
    save = async () => {
        try {
            const userResponse = await usersCollection.doc(this.uid).set(this.getUserFields());
            return Promise.resolve({ user: this.getUserFields() });
        }catch(error) {
            return Promise.reject(error);
        }
    }
    getUserFields = () => {
        return {
            uid: this.uid,
            email: this.email,
            userAvatar: this.userAvatar,
            userCellPhone: this.userCellPhone,
            userName: this.userName,
            userNickname: this.userNickname,
            fcmToken: this.fcmToken,
            userType: this.userType,
            createdAt: this.createdAt,
            platform: this.platform,
            permissions: this.permissions,
        }
    }
}

export default UserModel;