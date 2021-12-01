import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../../baseUrl'
import {fetchIssues, requestLogout, receiveLogout} from "./issueAction"

//Edit user
export const editUser = (_id:string, firstname:string, lastname:string, roll:number, email:string) => async (dispatch:Function) => {
    const newUser = {
  firstname: firstname,
  lastname: lastname,
  roll: roll,
  email: email  };
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return await fetch(baseUrl + 'users/' + _id, {
        method: "PUT"
      //  ,     credentials: 'same-origin'
        ,      body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        } })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error:any = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(response => { 
      localStorage.removeItem('userinfo');
      localStorage.setItem('userinfo', JSON.stringify(response));
      return dispatch(editUserdispatch(response));})
    .catch(error =>  {  
    alert('Your profile could not be edited\nError: '+error.message+'\n May be someone has already registered with that Roll No. or Email'); });
  };

  //Load users
  export const usersFailed = (errmess:Error) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
  });
  export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
  });
  export const fetchUsers = () => async (dispatch:Function) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    dispatch(usersLoading());
    return fetch(baseUrl+'users',{
      headers: {
        'Authorization': bearer
      }
    })
        .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error:any = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(users => dispatch(addUsers(users)))
    .catch(error => dispatch(usersFailed(error.message)));
}

export const addUsers = (users:any) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
  });
  

export const editUserdispatch = (USER:any) => ({
    type: ActionTypes.EDIT_USER,
    payload: USER
  });
  
export const editPasswordDispatch = (CREDS:any) => ({
    type: ActionTypes.EDIT_PASSWORD,
    payload: CREDS
})

export const requestLogin = (creds:any) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
  }
  
  export const receiveLogin = (response:any) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token,
        userinfo: response.userinfo
    }
  }
  
  export const loginError = (message:any) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
  }
  
  export const loginUser = (creds:any) => async (dispatch:Function) => {
    dispatch(requestLogin(creds));
    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var error:any = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            localStorage.setItem('userinfo', JSON.stringify(response.userinfo));    
            dispatch(fetchIssues(!response.userinfo.admin));      
            if(response.userinfo.admin) {
              dispatch(fetchUsers())
            }
            setTimeout(()=>{
              logoutUser();
              alert('Your JWT token has expired. \nPlease log in again to continue.');
             },3600*1000);
            // Dispatch the success action
            dispatch(receiveLogin(response));
        
        }
        else {
            var error:any = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => {
      alert(error.message+'\n'+"Username and password didn't match");
       return dispatch(loginError(error.message));})
  };
  
export const logoutUser = () => async (dispatch:any) => {
  await dispatch(requestLogout())
  localStorage.removeItem('token');
  localStorage.removeItem('creds');  
  localStorage.removeItem('userinfo');  
  dispatch(receiveLogout())
}

export const editPassword = (_id:string,username:string,password:string) => async (dispatch:Function) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'users/password/' + _id, {
    method: "PUT"
  //  ,     credentials: 'same-origin'
    ,      body: JSON.stringify({password: password}),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    } })
.then(response => {
    if (response.ok) {
      return response;
    } else {
      var error:any = new Error('Error ' + response.status + ': ' + response.statusText+'\n ');
      error.response = response;
      throw error;
    }
  },
  error => {
        throw error;
  })
.then(response => response.json())
.then(response => { 
  let newCreds={username: username, password: password};
  localStorage.removeItem('creds');
  localStorage.setItem('creds', JSON.stringify(newCreds));
  alert('Password changed successfully');
  return dispatch(editPasswordDispatch(newCreds));})
.catch(error =>  {  
alert('Your password could not be changed\nError: '+error.message); });
}

export const registerUser = (creds:any) => async (dispatch:Function) => {
  return fetch(baseUrl + 'users/signup', {
      method: 'POST',
      headers: { 
          'Content-Type':'application/json' 
      },
      body: JSON.stringify(creds)
  })
  .then(response => {
      if (response.ok) {
          return response;
      } else {
          var error:any = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
      },
      error => {
          throw error;
      })
  .then(response => response.json())
  .then(response => {
      if (response.success) {
          // If Registration was successful, alert the user
          alert('Registration Successful');
        }
      else {
          var error:any = new Error('Error ' + response.status);
          error.response = response;
          throw error;
      }
  })
  .catch(error => alert(error.message+'\n'+
      'May be someone has already registered with that username, email or Roll No.\nTry Entering a new username,email or Roll No. '))
};