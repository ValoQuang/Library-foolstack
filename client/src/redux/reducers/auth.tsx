import * as ActionTypes from '../actions/ActionTypes';
import {PayloadAction} from '@reduxjs/toolkit'
// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

var getLocalCred:any = localStorage.getItem('creds');
var getLocalUserInfo:any = localStorage.getItem('creds');
var getLocalToken:any = localStorage.getItem('token')

export interface A {
    type:String,
    creds: any,
    token:any,
    userinfo:any,
    message:any,
    payload:any
}

const Auth = (state = {
        isLoading: false,
        isAuthenticated: getLocalToken ? true : false,
        token: getLocalToken,
        user: getLocalCred ? JSON.parse(getLocalCred) : null,
        userinfo: localStorage.getItem('userinfo') ? JSON.parse(getLocalUserInfo) : null,
        errMess: null
    }, action:A) => {
    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: false,
                user: action.creds
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                errMess: '',
                token: action.token,
                userinfo: action.userinfo
            };
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: true
            };
            
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                token: '',
                user: null,
                userinfo: null
            };

        case ActionTypes.EDIT_USER:
            return {...state,
                userinfo: action.payload};

        case ActionTypes.EDIT_PASSWORD:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}

export default Auth;