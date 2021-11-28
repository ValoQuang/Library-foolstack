import * as ActionTypes from '../actions/ActionTypes';
import {PayloadAction} from '@reduxjs/toolkit'

const Users = (state = { isLoading: true,
    errMess: null,
    users:[]}, action:PayloadAction<Object>) => {
    switch (action.type) {
        case ActionTypes.ADD_USERS:
            return {...state, isLoading: false, errMess: null, users: action.payload};

        case ActionTypes.USERS_LOADING:
            return {...state, isLoading: true, errMess: null, users: []}

        case ActionTypes.USERS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
            return state;
    }
};
export default Users;