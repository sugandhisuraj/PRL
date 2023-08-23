import EventModel from '../../components/home/event/createEvent/Event.model';
import ViewEventModel from '../../components/home/event/joinEvent/viewEvent.model';
import { sortArrayAlphabatically } from '@utils';

import {
    eventCategoriesCollection,
    eventSubCategoriesCollection,
    eventGenreTypesCollection,
    contestTypesCollection,
    eventsCollection
} from '../../firebase';

//Event Actions
export const UPDATE_EVENTMODEL = 'UPDATE_EVENTMODEL';
export const UPDATE_VIEWEVENTMODEL = 'UPDATE_VIEWEVENTMODEL';


export const initEventModel = async (firebaseAllCollectionData) => {
    try {
        const eventCategories = [...firebaseAllCollectionData.eventCategoriesData];
        const eventSubCategories = [...firebaseAllCollectionData.eventSubCategoriesData];
        const eventGenre = [...firebaseAllCollectionData.eventGenreData];
        const contestTypes = [...firebaseAllCollectionData.contestTypesData];
        let charityData = [...firebaseAllCollectionData.charityData]; 
        const eventModel = new EventModel();
        const savedEvent = eventModel.loadContents(
            eventCategories,
            eventSubCategories,
            eventGenre,
            contestTypes,
            charityData);
        return updateEventModel(savedEvent);
    } catch (error) {
        console.log("ERROR_INIT_EVENT_MODEL - ", error);
    }
}

export const initViewEventModel = async (firebaseAllCollectionData) => {
    const events = [ ...firebaseAllCollectionData.eventsData ];
    const eventCategories = [ ...firebaseAllCollectionData.eventCategoriesData ];
    const eventSubCategories = [ ...firebaseAllCollectionData.eventSubCategoriesData ];
    const eventGenre = [ ...firebaseAllCollectionData.eventGenreData ];
    const contestTypes = [ ...firebaseAllCollectionData.contestTypesData ];
    let vEventModel = new ViewEventModel();
    let newVEventModel = vEventModel.init(
        events,
        eventCategories,
        eventSubCategories,
        eventGenre,
        contestTypes);
    return updateViewEventModel(newVEventModel);
}
export const updateEventModel = (payload) => {
    return {
        type: UPDATE_EVENTMODEL,
        payload
    }
}
export const updateViewEventModel = payload => {
    return {
        type: UPDATE_VIEWEVENTMODEL,
        payload
    }
}

/*
import EventModel from '../../components/home/event/createEvent/Event.model';
import ViewEventModel from '../../components/home/event/joinEvent/viewEvent.model';

import {
    eventCategoriesCollection,
    eventSubCategoriesCollection,
    eventGenreTypesCollection,
    contestTypesCollection,
    eventsCollection
} from '../../firebase';

//Event Actions
export const UPDATE_EVENTMODEL = 'UPDATE_EVENTMODEL';
export const UPDATE_VIEWEVENTMODEL = 'UPDATE_VIEWEVENTMODEL';


export const initEventModel = async () => {
    try {
        const eventCategories = await eventCategoriesCollection.get();
        const eventSubCategories = await eventSubCategoriesCollection.get();
        const eventGenre = await eventGenreTypesCollection.get();
        const contestTypes = await contestTypesCollection.get();
        const currentEventId = await eventsCollection.doc().id;
        console.log("EVENT_ID_CREATE_IN_INIT - ", currentEventId);
        const eventModel = new EventModel();
        const savedEvent = eventModel.loadContents(eventCategories, eventSubCategories, eventGenre, contestTypes, currentEventId);
        return updateEventModel(savedEvent);
    } catch (error) {
        console.log("ERROR_INIT_EVENT_MODEL - ", error);
    }
}

export const initViewEventModel = async () => {
    const events = await eventsCollection.get();
    const eventCategories = await eventCategoriesCollection.get();
    const eventSubCategories = await eventSubCategoriesCollection.get();
    const eventGenre = await eventGenreTypesCollection.get();
    const contestTypes = await contestTypesCollection.get();
    let vEventModel = new ViewEventModel();
    let newVEventModel = vEventModel.init(
        events,
        eventCategories,
        eventSubCategories,
        eventGenre,
        contestTypes);
    return updateViewEventModel(newVEventModel);
}
export const updateEventModel = (payload) => {
    return {
        type: UPDATE_EVENTMODEL,
        payload
    }
}
export const updateViewEventModel = payload => {
    return {
        type: UPDATE_VIEWEVENTMODEL,
        payload
    }
}

 */