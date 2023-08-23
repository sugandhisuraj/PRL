import EventModel from '../../components/home/event/createEvent/Event.model';
import ViewEventModel from '../../components/home/event/joinEvent/viewEvent.model';

import { UPDATE_EVENTMODEL, UPDATE_VIEWEVENTMODEL } from '../actions/eventActions';

const INITIAL_STATE = {
    events: [],
    error: null,

    eventModel: new EventModel(),
    viewEventModel: new ViewEventModel()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'EVENTS_READ':
            const events = action.payload.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            return { ...state, events };
        case UPDATE_EVENTMODEL:
            return {
                ...state,
                eventModel: action.payload
            }
        case UPDATE_VIEWEVENTMODEL: 
            return {
                ...state,
                viewEventModel: action.payload
            }
        default:
            return state
    }
}