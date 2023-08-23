
import { transformFirebaseValues } from '@utils';
import {
    db,
    usersCollection,
    eventsCollection,
    charitiesCollection
} from '../../../firebase';
import { Platform } from 'react-native';
class FirebaseOperations {

    addkeyToUserCollection = async () => {
        console.log('ADDING_KEY_TO_USER_COLLECTION');
        var batch = db.batch();
        const userColData = await usersCollection.get();
        let eventsData = transformFirebaseValues(userColData, 'email', [{}]);
        eventsData.forEach((docs) => {
            var docRef = usersCollection.doc(docs.id);
            batch.update(docRef, {
                userType: 'user',    
                userType: 'user',
                createdAt: new Date(),
                fcmToken: '',
                platform: Platform.OS,
                permissions: {
                    showAds: false,
                    showHostEvents: false,
                    showAddCharities: false
                },
            });

        });
        batch.commit();
        console.log('END_ADDING_KEY_TO_USER_COLLECTION');
    }

    addKeyToEventCollection = async () => {
        console.log('ADDING_KEY_TO_EVENT_COLLECTION');
        var batch = db.batch();
        const eventData = await eventsCollection.get();
        let eventsData = transformFirebaseValues(eventData, 'eventID', [{}]);
        eventsData.forEach((docs) => {
            var docRef = eventsCollection.doc(docs.id);
            batch.update(docRef, {
                organizerID: 'Qyrd1rk9zIX6kOuZFqVsrpWJZKg1',
                organizerName: 'Suraj'
            });

        });
        batch.commit();
        console.log('END_ADDING_KEY_TO_EVENT_COLLECTION');
    }

    addKeysToCharities = async () => {
        console.log('ADDING_KEY_TO_CHARITY_COLLECTION');
        var batch = db.batch();
        const charityDataFire = await charitiesCollection.get();
        let charityData = transformFirebaseValues(charityDataFire, 'charityID', [{}]);
        charityData.forEach((docs) => {
            var docRef = charitiesCollection.doc(docs.id);
            batch.update(docRef, {
                organizerID: 'Qyrd1rk9zIX6kOuZFqVsrpWJZKg1',
                organizerName: 'Suraj'
            });

        });
        batch.commit();
        console.log('ADDING_KEY_TO_CHARITY_COLLECTION');
    }

    updateFirebaseToken = async (userColData, fcmToken = '') => {
        console.log('TEST_CHECK_NOT_INS_TO ', fcmToken);
        if (!userColData.fcmToken || userColData.fcmToken != fcmToken) {
            const updateUserColData = await usersCollection.doc(userColData.uid)
                .update({
                    fcmToken
                });
            console.log('UPDATE_TOKEN_DATA - ', updateUserColData);
        }
    }
    unlinkFcm = async (userId) => {
        const updatedUserColRes = await usersCollection.doc(userId).update({
            fcmToken: ''
        });
        console.log('UPDATE_UNLINK - ', updatedUserColRes);
    }
}

// let userModel = {
//     uid: user.uid,
//     email: email,
//     userAvatar,
//     userCellPhone,
//     userName,
//     userNickname,
//     //userType: 'admin',
//     userType: 'user',
//     createdAt: new Date(),
//     fcmToken,
//     platform: Platform.OS
// };
export default new FirebaseOperations();