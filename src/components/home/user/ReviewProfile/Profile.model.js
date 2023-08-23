
import { transformFirebaseValues, removeDuplicateFromArr } from '@utils';
class ProfileModel {
    loading = true;
    currentProfile = {};
    currentProfileIndex = -1;

    editMode = false;
    editFields = {};
    currentLoggedInUserProfiles = [];
    isCompetition = false;

    resetContents = () => {
        this.loading = true;
        this.currentProfile = {};
        this.currentProfileIndex = -1;
        this.editMode = false;
        this.editFields = {};
        this.currentLoggedInUserProfiles = [];
        this.isCompetition = false;
        return this.createClone();
    }
    loadContents = (
        profileData,
        userEnteredContest,
        charitiesData,
        eventsData,
        loggedInUserId,
        isCompetition,
        userCollectionData,
        authData
    ) => {
        let userColData = [];
        if (isCompetition) {
            userColData = transformFirebaseValues(userCollectionData, 'uid');
        }
        let playerEventProfile = transformFirebaseValues(profileData, 'profileID');

        let charityData = charitiesData;
        let eventData = eventsData;

        let allIsCompetitionEvents = [];
        let currentLoggedInUserProfiles = [];


        let transFormedData = playerEventProfile.map((profile) => {
            let injectData = { charityData: {}, eventData: {}, userData: {} };
            charityData.map((charity) => {
                if (charity.charityID == profile.profilePlayerForCharityID) {
                    injectData.charityData = { ...charity };
                }
            });
            eventData.map((event) => {
                if (event.eventID == profile.eventID) {
                    injectData.eventData = { ...event };
                }
            });
            if (isCompetition) {
                userColData.map(user => {
                    if (user.uid == profile.userID) {
                        injectData.userData = { ...user };
                    }
                });
            } else {
                injectData.userData = { ...authData.userCol };
            }
            if (loggedInUserId == profile.userID) {
                currentLoggedInUserProfiles.push({
                    ...profile,
                    ...injectData
                });
            }

            return {
                ...profile,
                ...injectData
            }
        });
        if (isCompetition) {
            let userEnteredContests = transformFirebaseValues(userEnteredContest, 'userID');
            let uniqueUserContest = removeDuplicateFromArr(userEnteredContests, 'eventID');

            uniqueUserContest.map((userCon) => {
                transFormedData.map((profileTransFormed) => {
                    if ((profileTransFormed.eventData.eventID ==
                        userCon.eventID) && (profileTransFormed.userID != loggedInUserId)) {
                        allIsCompetitionEvents.push({
                            ...profileTransFormed
                        });
                    }
                })
            });
        }

        this.currentLoggedInUserProfiles = isCompetition ? [...allIsCompetitionEvents] : [...currentLoggedInUserProfiles];
        this.currentProfileIndex = 0;
        this.isCompetition = isCompetition;
        this.loading = false;
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
        let currentData = this.currentLoggedInUserProfiles[this.currentProfileIndex];
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
            disabledLeft: (this.currentProfileIndex == this.currentLoggedInUserProfiles.length - 1),
            disabledRight: this.currentProfileIndex == 0,
            userAvatar: currentData?.userData?.userAvatar || '',
            profileImageQ: currentData?.profileImageQ || '',
            profileVideoQ: currentData?.profileVideoQ || ''
        }
    }
    switchIndex = (type = "+") => {

        if (type == "+") {
            if (this.currentProfileIndex < this.currentLoggedInUserProfiles.length - 1) {
                this.currentProfileIndex++;
            }
        } else {
            if (this.currentProfileIndex > 0) {
                this.currentProfileIndex--;
            }
        }

        if (this.editMode) {
            this.editMode = false;
            this.editFields = {};
        }
        return this.createClone();
    }


    getIsCurrentUser = (userID) => {
        return true;

    }

    switchEditMode = (editMode, key = 'profileA1', value = '') => {
        if (editMode == 'UPDATE_TUPLE') {
            let updatedDataFromFirebase = key.data();
            let newPlayerEventData = [...this.currentLoggedInUserProfiles];
            newPlayerEventData[this.currentProfileIndex].profileA1 = updatedDataFromFirebase.profileA1;
            newPlayerEventData[this.currentProfileIndex].profileA2 = updatedDataFromFirebase.profileA2;
            newPlayerEventData[this.currentProfileIndex].profileA3 = updatedDataFromFirebase.profileA3;
            newPlayerEventData[this.currentProfileIndex].profileA4 = updatedDataFromFirebase.profileA4;
            newPlayerEventData[this.currentProfileIndex].profilePlayerPicture = updatedDataFromFirebase.profilePlayerPicture;
            newPlayerEventData[this.currentProfileIndex].profileVideo = updatedDataFromFirebase.profileVideo;
            this.currentLoggedInUserProfiles = newPlayerEventData;
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
            this.editFields = { ...this.currentLoggedInUserProfiles[this.currentProfileIndex] }
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

/*

userCollectionData.map((u)=>{
                if(u.uid == profile.userID) {
                    injectData.userData = {...u};
                }
            });
 let injectData = { charityData: {}, eventData: {},userData: {} };
 userAvatar: currentData?.userData?.userAvatar || '',
            */