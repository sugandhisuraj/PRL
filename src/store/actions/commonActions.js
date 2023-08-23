import { transformFirebaseValues, sortArrayAlphabatically } from '@utils';
import {
    eventCategoriesCollection,
    eventSubCategoriesCollection,
    eventGenreTypesCollection,
    contestTypesCollection,
    eventsCollection,
    charitiesCollection,
    contestBracketTypesCollection,
    userEnteredContestsCollection,
    userEventInviteListCollection
} from '../../firebase';

export const READY_FIREBASE_DATA = 'READY_FIREBASE_DATA';
export const READY_FIREBASE_DATA_ERROR = 'READY_FIREBASE_DATA_ERROR';
export const UPDATE_FIREBASE_DATA_EVENTS = 'UPDATE_FIREBASE_DATA_REDUX';

const getEventsFromFirebase = async (eventCategoriesData, userCollectionData) => {
    console.log('USER_COLLECTION_DATA_CHECK_HERE - ', JSON.stringify(userCollectionData));
    // Categorization according to the category if userShow is true
    let searchedCategoryFilter = eventCategoriesData.filter(i => i.userShow == true);
    let searchedCategoryArray = searchedCategoryFilter.map(i => i.eventCategory);
    console.log('SEARCHED_COMMAND_DATA - ', searchedCategoryArray);
    //Array = ['Public', 'Public Charity'];
    let eventsQuery = eventsCollection.where("eventCategory", "in", searchedCategoryArray).get();

    //Any Private event - they are signed up (userEnteredContests) for that Event ID
    let privateEventsQuery = eventsCollection.where("eventCategory", "==", 'Private').get();
    let userEnteredContestsQuery = userEnteredContestsCollection.where('userID', '==', userCollectionData.userId).get();
    let userEventInviteListQuery = userEventInviteListCollection.where('email', '==', userCollectionData.userCol.email).get();
    const [
        eventsFire,
        privateEventsFire,
        userEnteredContestsFire,
        userEventInviteListFire
    ] = await Promise.all([
        eventsQuery,
        privateEventsQuery,
        userEnteredContestsQuery,
        userEventInviteListQuery]);
    let eventsData = [];
    eventsData = transformFirebaseValues(eventsFire, 'eventName', [{ isSelected: false }]);

    //Transform Private Events
    let privateEvents = transformFirebaseValues(privateEventsFire, 'eventName', [{ isSelected: false }]);
    let userEnteredContests = transformFirebaseValues(userEnteredContestsFire, 'contestName', [{ isSelected: false }]);
    let userEventInviteList = transformFirebaseValues(userEventInviteListFire, 'eventID', [{}]);
    //Checking if the current logged in user had signed up any events
    if (userEnteredContests.length > 0) {
        console.log('ATLEAST_I_AM_IN_LOOP - ', userEnteredContests.length);
        for (let i = 0; i < privateEvents.length; i++) {
            for (let j = 0; j < userEnteredContests.length; j++) {
                if (privateEvents[i].eventID ==
                    userEnteredContests[j].eventID) {
                    eventsData.push(privateEvents[i]);
                    break;
                }
            }
        }

    }
    //Any Private event They are invited to, their email in userEventInviteList for that Event ID
    if (userEventInviteList.length > 0) {
        userEventInviteList.map(i => {
            let findPrivateEvent = privateEvents.find(e => e.eventID == i.eventID);
            if (findPrivateEvent) {
                eventsData.push(findPrivateEvent)
            }
        });
    }
    return eventsData;
}
export const initFirebaseCollectionsData = async (userCollectionData) => {
    try {
        const eventCategoriesQuery = eventCategoriesCollection.where("isActive", "==", true).get();
        const eventSubCategoriesQuery = eventSubCategoriesCollection.where("isActive", "==", true).get();
        const eventGenreQuery = eventGenreTypesCollection.where("isActive", "==", true).get();
        const contestTypesQuery = contestTypesCollection.where("isActive", "==", true).get();
        const charitiesQuery = charitiesCollection.where("isActive", "==", true).get();
        const contestBracketTypesQuery = contestBracketTypesCollection.get();

        const [
            eventCategories,
            eventSubCategories,
            eventGenre,
            contestTypes,
            charities,
            contestBracketTypes
        ] = await Promise.all([
            eventCategoriesQuery,
            eventSubCategoriesQuery,
            eventGenreQuery,
            contestTypesQuery,
            charitiesQuery,
            contestBracketTypesQuery
        ]);
        let eventCategoriesData = transformFirebaseValues(eventCategories, 'name', [{ isSelected: false }]);
        let eventSubCategoriesData = transformFirebaseValues(eventSubCategories, 'name', [{ isSelected: false }]);
        let eventGenreData = transformFirebaseValues(eventGenre, 'eventGenreType', [{ isSelected: false }]);
        let contestTypesData = transformFirebaseValues(contestTypes, 'contestType', [{ isSelected: false }]);
        let charityDataa = transformFirebaseValues(charities, 'charityName', [{ isSelected: false }]);
        let contestBracketTypesData = transformFirebaseValues(contestBracketTypes, 'name', [{ isSelected: false }]);
        let charityData = sortArrayAlphabatically(charityDataa, 'sortOrder');
        //Getting Events Type
        let eventsData;
        if (userCollectionData.userCol.userType == 'admin') {
            console.log('I_AM_HERE_FETCH_ALL');
            let events = await eventsCollection.get();
            eventsData = transformFirebaseValues(events, 'eventName', [{ isSelected: false }]);
        } else {
            eventsData = await getEventsFromFirebase(eventCategoriesData, userCollectionData);
        }

        //Getting Events Type Ends


        let allFirebaseData = {
            eventsData,
            eventCategoriesData,
            eventSubCategoriesData,
            eventGenreData,
            contestTypesData,
            charityData,
            contestBracketTypesData
        }
        return updateFirebaseCollectionData(allFirebaseData);
    } catch (error) {
        console.log('ERROR_WHILE_initViewEventModel()', error);
        return errorFirebaseCollectionData(error);
    }
}
export const updateFirebaseCollectionData = (payload) => {
    return {
        type: READY_FIREBASE_DATA,
        payload
    }
}
export const errorFirebaseCollectionData = (payload) => {
    return {
        type: READY_FIREBASE_DATA_ERROR,
        error: payload
    }
}

export const updateFirebaseDataEvents = (events, oldState, updateKey = 'eventsData') => {

    let newAllFirebaseData = { ...oldState };
    newAllFirebaseData[updateKey] = [ ...events ];
    return {
        type: UPDATE_FIREBASE_DATA_EVENTS,
        payload: newAllFirebaseData
    }
}