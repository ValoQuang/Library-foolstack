import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../../baseUrl'

export const editUser = (_id, firstname, lastname, roll, email) => (dispatch) => {
    const newUser = {
  firstname: firstname,
  lastname: lastname,
  roll: roll,
  email: email  };
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'users/' + _id, {
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
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
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
  
  export const fetchUsers = () => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    dispatch(usersLoading(true));
    return fetch(baseUrl+'users',{
      headers: {
        'Authorization': bearer
      }
    })
        .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
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

export const addUsers = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
  });
  
export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
});

export const editUserdispatch = (USER) => ({
    type: ActionTypes.EDIT_USER,
    payload: USER
  });
  
export const editPasswordDispatch = (CREDS) => ({
    type: ActionTypes.EDIT_PASSWORD,
    payload: CREDS
})

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
  }
  
  export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token,
        userinfo: response.userinfo
    }
  }
  
  export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
  }
  
  export const loginUser = (creds) => (dispatch) => {
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
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
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
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => {
      alert(error.message+'\n'+"Username and password didn't match");
       return dispatch(loginError(error.message));})
  };
  
export const registerUser = (creds) => (dispatch) => {
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
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
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
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => alert(error.message+'\n'+
        'May be someone has already registered with that username, email or Roll No.\nTry Entering a new username,email or Roll No. '))
};
