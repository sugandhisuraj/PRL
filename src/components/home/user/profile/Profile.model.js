
import { transformFirebaseValues } from '@utils';
class ProfileModel {
    loading = true;
    currentProfile = {};
    currentProfileIndex = -1;
    isAllActionDone = false;
    playerEventProfile = [];
    editMode = false;
    editFields = {};
    isCurrentUserFind = false;
    loadContents = (
        profileData,
        charitiesData,
        eventsData,
        userID,
        userData
    ) => {

        let playerEventProfile = transformFirebaseValues(profileData, 'profileID');
        const userCollectionData = transformFirebaseValues(userData, 'uid');
        let charityData = charitiesData;
        let eventData = eventsData;
        let transformedPlayerEventProfile = playerEventProfile.map((profile) => {
            let injectData = { charityData: {}, eventData: {},userData: {} };
            charityData.map((charity) => {
                if (charity.charityID == profile.profilePlayerForCharityID) {
                    injectData.charityData = {...charity};
                }
            });
            eventData.map((event) => {
                if (event.eventID == profile.eventID) {
                    injectData.eventData = {...event};
                }
            });
            userCollectionData.map((u)=>{
                if(u.uid == profile.userID) {
                    injectData.userData = {...u};
                }
            });

            return {
                ...profile,
                ...injectData
            }
        });
        console.log('TRANS_TEST_1 -', JSON.stringify(transformedPlayerEventProfile));
        let specificUserIndex = transformedPlayerEventProfile.findIndex(i => i.userID == userID);
        this.currentProfileIndex = 0;
        this.isCurrentUserFind = true;
        if (specificUserIndex > -1) {
            this.currentProfileIndex = specificUserIndex;
        } else {
            this.isCurrentUserFind = false;
        }
        this.playerEventProfile = transformedPlayerEventProfile;
        this.loading = false;
        this.isAllActionDone = true;
        return this.createClone();
    }

    update = (key, value) => {
        this[key] = value;
        return this.createClone();
    }
    updates = (data) => {
        for (let key in data) {
            for (let objKey in data[key]) {
                this[objKey] = data[key][objKey];
            }
        }
        return this.createClone();
    }
    createClone = () => {
        return { ...this };
    }
    getCurrentProfileData = () => {
        let currentData = this.playerEventProfile[this.currentProfileIndex];  
        return {
            name: currentData?.profileFirstName || '',
            nickName: currentData?.profileNickname || '',
            charity: currentData?.charityData?.charityName || '',
            eventName: currentData?.eventData?.eventName || '',
            profileQ1Label: currentData?.profileQ1Label || '',
            profileQ2Label: currentData?.profileQ2Label || '',
            profileQ3Label: currentData?.profileQ3Label || '',
            profileQ4Label: currentData?.profileQ4Label || '',
            profileA1: currentData?.profileA1 || '',
            profileA2: currentData?.profileA2 || '',
            profileA3: currentData?.profileA3 || '',
            profileA4: currentData?.profileA4 || '',
            profileVideo: currentData?.profileVideo || '',
            profilePlayerPicture: currentData?.profilePlayerPicture || '',
            userAvatar: currentData?.userData?.userAvatar || '',
            disabledLeft: (this.currentProfileIndex == this.playerEventProfile.length - 1),
            disabledRight: this.currentProfileIndex == 0,
            profileImageQ:  currentData?.profileImageQ || '',
            profileVideoQ: currentData?.profileVideoQ || ''
        }
    }
    switchIndex = (type = "+") => {
        console.log('TEST_CHECK_1T - ', this.playerEventProfile.length);
        
        if (this.playerEventProfile.length > 0) {
            this.isCurrentUserFind = true;
            if (type == "+") {
                if (this.currentProfileIndex < this.playerEventProfile.length - 1) {
                    this.currentProfileIndex++;
                }
            } else {
                if (this.currentProfileIndex > 0) {
                    this.currentProfileIndex--;
                }
            }
        }

        if (this.editMode) {
            this.editMode = false;
            this.editFields = {};
        }
        return this.createClone();
    }
    getIsCurrentUser = (userID) => {
        console.log('USER_ID_RECIEVE - ', userID);
        if (this.playerEventProfile.length > 0 && this.currentProfileIndex > -1) {
            return this.playerEventProfile[this.currentProfileIndex].userID == userID;
        }
        return false;

    }

    switchEditMode = (editMode, key = 'profileA1', value = '') => {
        if (editMode == 'UPDATE_TUPLE') {
            let updatedDataFromFirebase = key.data();
            console.log("UPDATED_DATA - ", JSON.stringify(updatedDataFromFirebase));
            let newPlayerEventData = [...this.playerEventProfile];
            newPlayerEventData[this.currentProfileIndex].profileA1 = updatedDataFromFirebase.profileA1;
            newPlayerEventData[this.currentProfileIndex].profileA2 = updatedDataFromFirebase.profileA2;
            newPlayerEventData[this.currentProfileIndex].profileA3 = updatedDataFromFirebase.profileA3;
            newPlayerEventData[this.currentProfileIndex].profileA4 = updatedDataFromFirebase.profileA4;
            newPlayerEventData[this.currentProfileIndex].profilePlayerPicture = updatedDataFromFirebase.profilePlayerPicture;
            newPlayerEventData[this.currentProfileIndex].profileVideo = updatedDataFromFirebase.profileVideo;
            this.playerEventProfile = newPlayerEventData;
            this.editFields = {};
            this.editMode = false;
            return this.createClone();
        }
        if (editMode == 'UPDATE_VAL') {
            let updatedEditFields = { ...this.editFields };
            updatedEditFields[key] = value;
            this.editFields = updatedEditFields;
            return this.createClone();
        }
        if (editMode == 'CLEAR') {
            let clearEditFields = { ...this.editFields };
            clearEditFields.profileA1 = '';
            clearEditFields.profileA2 = '';
            clearEditFields.profileA3 = '';
            clearEditFields.profileA4 = '';
            clearEditFields.profilePlayerPicture = null;
            clearEditFields.profileVideo = null;
            this.editFields = clearEditFields;
            return this.createClone();
        }
        this.editMode = editMode;

        if (editMode) {
            this.editFields = { ...this.playerEventProfile[this.currentProfileIndex] }
        } else {
            this.editFields = {};
        }
        return this.createClone();
    }

    getEditedFields = () => {
        let currentEditedField = { ...this.editFields };

        return {
            id: currentEditedField.id,
            data: {
                profileA1: currentEditedField.profileA1,
                profileA2: currentEditedField.profileA2,
                profileA3: currentEditedField.profileA3,
                profileA4: currentEditedField.profileA4,
                profilePlayerPicture: currentEditedField.profilePlayerPicture,
                profileVideo: currentEditedField.profileVideo
            }
        }
    }
}

export default new ProfileModel();