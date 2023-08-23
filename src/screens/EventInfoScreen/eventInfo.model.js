
import { transformFirebaseValues } from '@utils';

// Mode == 0 ? 'View': 'Edit';
class EventInfoModel {

    currentEventData = {};
    loading = true;
    mode = 0;

    //Edit Code
    currentEventEditData = {};
    editData = {};

    onRefresh = () => {
        this.currentEventData = {};
        this.loading = true;
        this.mode = 0;

        //Edit Code
        this.currentEventEditData = {};
        this.editData = {};
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

    init = (
        currentEventData,
        firebaseCollectionData,
        contestCollectionResponse,
        playerProfileResponse
    ) => {
        const contestData = transformFirebaseValues(contestCollectionResponse, 'contestID', [{ isSelected: false }]);
        const eventProfileQuestions = transformFirebaseValues(playerProfileResponse, 'eventID');
        let injectPlayerQuestions = eventProfileQuestions.length > 0 ? eventProfileQuestions[0] : {};
        let charityData = firebaseCollectionData.charityData.find(charity => {
            return currentEventData?.charityID == charity?.charityID;
        });
        this.currentEventData = {
            ...currentEventData,
            charityData,
            contestData,
            eventProfileQuestions: injectPlayerQuestions
        };
        this.currentEventEditData = {
            ...currentEventData,
            charityData,
            contestData,
            eventProfileQuestions: injectPlayerQuestions
        }


        //Code for Edit Work
        let editData = {
            charityData: firebaseCollectionData.charityData,
            eventCategoriesData: firebaseCollectionData.eventCategoriesData,
            eventSubCategoriesData: firebaseCollectionData.eventSubCategoriesData,
            eventGenreData: firebaseCollectionData.eventGenreData
        }
        this.editData = editData;
        //Code for Edit work ends
        this.loading = false;
        return this.createClone();
    }

    onEditEvent = (key, value) => {
        let newCurrentEventEditData = { ...this.currentEventEditData };
        newCurrentEventEditData[key] = value;
        this.currentEventEditData = newCurrentEventEditData;
        return this.createClone();
    }
    savePlayerProfileData = () => {
        let playerProfileData = { ...this.currentEventEditData.eventProfileQuestions };
        return {
            id: playerProfileData.id,
            data: {
                profileQ1Label: playerProfileData.profileQ1Label,
                profileQ2Label: playerProfileData.profileQ2Label,
                profileQ3Label: playerProfileData.profileQ3Label,
                profileQ4Label: playerProfileData.profileQ4Label,
                profileImageQ: playerProfileData.profileImageQ,
                profileVideoQ: playerProfileData.profileVideoQ
            }
        }
    }
    saveEditEventData = () => {
        let editEventData = { ...this.currentEventEditData };
        return {
            id: editEventData.id,
            data: {
                eventName: editEventData.eventName,
                eventDate: editEventData.eventDate,
                eventDateEnd: editEventData.eventDateEnd,
                charityID: editEventData.charityID,
                charityType: editEventData.charityType,
                eventCategory: editEventData.eventCategory,
                eventSubCategory: editEventData.eventSubCategory,
                eventGenre: editEventData.eventGenre,
                eventDescription: editEventData.eventDescription,
                eventPaymentTerms: editEventData.eventPaymentTerms,
                eventThankYou: editEventData.eventThankYou,
                eventInformation: editEventData.eventInformation,

                eventLogo: editEventData.eventLogo,
                eventPicture: editEventData.eventPicture,
                eventVideo: editEventData.eventVideo,
            }
        }
    }

    refreshAfterEdit = (updatedData, firebaseCollectionData, playerProfileData) => {
        let updateOldCurrentEventData = { ...this.currentEventData };
        let updateCurrentNewEventData = {
            ...updateOldCurrentEventData,
            ...updatedData
        }
        let charityData = firebaseCollectionData.charityData.find(charity => {
            return updateCurrentNewEventData?.charityID == charity?.charityID;
        });
        this.currentEventData = {
            ...updateCurrentNewEventData,
            charityData,
            eventProfileQuestions: {
                ...updateCurrentNewEventData.eventProfileQuestions,
                ...playerProfileData
            }
        };
        this.currentEventEditData = {
            ...updateCurrentNewEventData,
            charityData,
            eventProfileQuestions: {
                ...updateCurrentNewEventData.eventProfileQuestions,
                ...playerProfileData
            }
        };
        this.mode = 0;
        return this.createClone();

    }
    onNewContestAdd = (contestData) => {
        //eventIModel.currentEventData.contestData
        let newCurrentEventData = { ...this.currentEventData };
        newCurrentEventData.contestData = [...newCurrentEventData.contestData];
        newCurrentEventData.contestData.push(contestData);
        this.currentEventData = newCurrentEventData;
        return this.createClone();

    }
    onEditPlayerProfile = (key, value = '') => {
        // this.currentEventEditData = {
        //     ...currentEventData,
        //     charityData,
        //     contestData,
        //     eventProfileQuestions: injectPlayerQuestions
        // };
        let newCurrentEventEditData = { ...this.currentEventEditData };
        newCurrentEventEditData.eventProfileQuestions = { ...this.currentEventEditData.eventProfileQuestions };
        newCurrentEventEditData.eventProfileQuestions[key] = value;
        this.currentEventEditData = newCurrentEventEditData;
        return this.createClone();
    }
}

export default new EventInfoModel();