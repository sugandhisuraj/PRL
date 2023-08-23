
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import rootReducer from './reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreWithMiddleware = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(promiseMiddleware))
);

export default createStoreWithMiddleware;