import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../../baseUrl'

export const addIssue = (issue) => ({
    type: ActionTypes.ADD_ISSUE,
    payload: issue
  });
  
  export const postIssue = (bookId,studentId) => (dispatch) => {
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
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
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
  
  export const returnIssue = (issueId) => (dispatch) => {
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
      alert('Book returned successfully');
      return dispatch(returnBookdispatch(response));})
    .catch(error =>  {  
    alert('The book could not be returned\nError: '+error.message); });
  };
  
  export const fetchIssues = (student) => (dispatch) => {
    let issueUrl;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    if(student) {
      issueUrl='issues/student';
    }
    else {
      issueUrl='issues';
    }
    dispatch(issuesLoading(true));
    return fetch(baseUrl+issueUrl,{
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
    .then(issues => dispatch(addIssues(issues)))
    .catch(error => dispatch(issuesFailed(error.message)));
  }
  
  
  
  export const issuesLoading = () => ({
    type: ActionTypes.ISSUES_LOADING
  });
  
  export const issuesFailed = (errmess) => ({
    type: ActionTypes.ISSUES_FAILED,
    payload: errmess
  });
  
  export const addIssues = (issues) => ({
    type: ActionTypes.ADD_ISSUES,
    payload: issues
  });
  
  export const usersFailed = (errmess) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
  });