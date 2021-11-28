import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import  Books  from './books';
import Auth from './auth';
import Issues from './issues';
import Users from './users'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export const ConfigureStore = ()=>{
    const store=createStore(
        combineReducers({
            books: Books,
            auth: Auth,
            issues: Issues,
            users: Users
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
}

