import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../../baseUrl'

export const addIssue = (issue:any) => ({
    type: ActionTypes.ADD_ISSUE,
    payload: issue
  });
  
  export const postIssue = (bookId:string,studentId:string) => (dispatch:Function) => {
      const newIssue = {
      book: bookId,
      student: studentId 
      };
      const bearer = 'Bearer ' + localStorage.getItem('token');
      return fetch(baseUrl + 'issues', {
          method: "POST",
          body: JSON.stringify(newIssue),
          headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
          }
       //   ,        credentials: "same-origin"
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
      .then(response => { alert('Book issued successfully');
        return  dispatch(addIssue(response));})
      .catch(error =>  {
        alert('Book could not be issued\nError: '+error.message+'\n'+
        'May be the student has already issued 3 books and not returned. Please return them first. \n'+
        'or the book may not available. You can wait for some days, until the book is returned to library.'); });
  };

  export const returnBookdispatch = (issue:any) => ({
    type: ActionTypes.RETURN_ISSUE,
    payload: issue
  });
  
  export const returnIssue = (issueId:any) => (dispatch:Function) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'issues/' + issueId, {
        method: "PUT"
      //  ,     credentials: 'same-origin'
      , headers: {
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
      alert('Book returned successfully');
      return dispatch(returnBookdispatch(response));})
    .catch(error =>  {  
    alert('The book could not be returned\nError: '+error.message); });
  };
  
  export const fetchIssues = (student:any) => async (dispatch:Function) => {
    let issueUrl:string;
     const bearer =  'Bearer ' + localStorage.getItem('token');
     if(student) {
       issueUrl= 'issues/student';
    }
    else {
      issueUrl='issues';
    }
    await dispatch(issuesLoading());
    return fetch(baseUrl+issueUrl,{
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
    .then(issues => dispatch(addIssues(issues)))
    .catch(error => dispatch(issuesFailed(error.message)));
  }
  
  
  
  export const issuesLoading = () => ({
    type: ActionTypes.ISSUES_LOADING
  });
  
  export const issuesFailed = (errmess:any) => ({
    type: ActionTypes.ISSUES_FAILED,
    payload: errmess
  });
  
  export const addIssues = (issues:any) => ({
    type: ActionTypes.ADD_ISSUES,
    payload: issues
  });

  export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
  }
  
  export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
  }