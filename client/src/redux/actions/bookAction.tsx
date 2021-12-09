import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../../baseUrl'
import { editPasswordDispatch } from './userAction';

export const booksLoading = () => ({
    type: ActionTypes.BOOKS_LOADING
});

export const booksFailed = (errmess:any) => ({
    type: ActionTypes.BOOKS_FAILED,
    payload: errmess
});

export const addBooks = (books:any) => ({
    type: ActionTypes.ADD_BOOKS,
    payload: books
});


export const addBook = (book:any) => ({
  type: ActionTypes.ADD_BOOK,
  payload: book
});

export const editBookdispatch = (books:any) => ({
    type: ActionTypes.EDIT_BOOK,
    payload: books
  });
  

export const deleteBookdispatch = (resp:any) => ({
    type: ActionTypes.DELETE_BOOK,
    payload: resp
});

export const postBook = (name:string, author:string, description:string, isbn:number, cat:string, floor:number, shelf:number, copies:number) => async (dispatch:Function) => {
    const newBook = {
      name: name, author: author,
       description: description, isbn: isbn,
        cat: cat, floor: floor, 
        shelf: shelf, copies: copies
    };
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return await fetch(baseUrl + 'books', {
        method: "POST",
        body: JSON.stringify(newBook),
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
    .then(response => { alert('Book added successfully');
      return  dispatch(addBook(response));})
    .catch(error =>  { alert('Your book could not be added\nError: '+error.message); });
};

export const editBook = (_id:string, name:string, author:string, description:string, isbn:number, cat:string, floor:number, shelf:number, copies:number) => async (dispatch:Function) => {
    const newBook = {
      name: name, author: author,
      description: description, isbn: isbn,
      cat: cat, floor: floor, 
      copies: copies
    };
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'books/' + _id, {
        method: "PUT"
      //  ,     credentials: 'same-origin'
        ,      body: JSON.stringify(newBook),
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
    .then(response => (dispatch(editBookdispatch(response))))
    .catch(error =>  {  
    alert('Your book could not be edited\nError: '+error.message); });
  };
  
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

  export const fetchBooks = () => async (dispatch:Function) => {
    dispatch(booksLoading());
    return fetch(baseUrl+'books')
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
    .then(books => dispatch(addBooks(books)))
    .catch(error => dispatch(booksFailed(error.message)));
}

export const deleteBook = (_id:string) => async (dispatch:Function) => { 
    const bearer = 'Bearer ' + localStorage.getItem('token');    
    return await fetch(baseUrl + 'books/' + _id, {
        method: "DELETE"
      //  ,       credentials: "same-origin"
        ,       headers: {
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
            throw error;
      })
    .then(response => response.json())
    .then(response => dispatch(deleteBookdispatch(response)))
    .catch(error =>  {alert('Your book could not be deleted\nError: '+error.message); });
};

