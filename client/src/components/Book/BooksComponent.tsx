import React,{Component} from 'react';
import { Table } from 'reactstrap';
import {Link} from 'react-router-dom';

import {CircularProgress} from "@mui/material"

// RenderBook is a functional component
interface renderBook {
    book:any,
    toggleEditModal:Function,
    isAdmin:Boolean,
    toggleDeleteModal:Function,
    changeSelected:Function,
    i: number
}

function RenderBook ({book, changeSelected ,isAdmin, toggleDeleteModal,toggleEditModal,i}:renderBook) {
    return (
            <React.Fragment>
            <td> {i} </td>
            <td> <Link to={`/books/${book._id}`}> {book.name} </Link> </td>
            <td>
                {book.isbn}
            </td>
            <td>
                {book.author}
            </td>
            <td>
                {book.copies}
            </td>
            {isAdmin?(<td><span onClick={()=>{changeSelected(book._id); toggleEditModal(); }} className="Option fa fa-pencil"/>
                          &nbsp; &nbsp; <span onClick={()=>{changeSelected(book._id); toggleDeleteModal();}} className="Option fa fa-trash"/>
                        </td>):(<React.Fragment/>)}
            </React.Fragment>
       );
}

interface bookList {
    books:any,
    booksLoading:boolean,
    isAdmin:Boolean,
    booksErrMess:Function,
    toggleEditModal:Function,
    toggleDeleteModal:Function,
    changeSelected:Function,
    i: number
}

class Booklist extends Component<bookList> {
    i: number;
    constructor(props:bookList){
        super(props);
        this.state={
        }
        this.i=1;
    }
    componentDidMount() {
        window.scrollTo(0, 0)
      }
render(){
    const list = this.props.books.map((book:any) => {
        return (
                <tr key={book.name}>
                    <RenderBook book={book} isAdmin={this.props.isAdmin} changeSelected={this.props.changeSelected}
                    toggleDeleteModal={this.props.toggleDeleteModal}
                    toggleEditModal={this.props.toggleEditModal}
                    i={this.i++}
                    />
                </tr>
        );
    });
    if (this.props.booksLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <CircularProgress />
                </div>
            </div>
        );
    }
    else if (this.props.booksErrMess) {
        return(
            <div className="container loading">
                <div className="row heading"> 
                    <div className="col-12">
                        <br/><br/><br/><br/>
                        <h3>{this.props.booksErrMess}</h3>
                    </div>
                </div>
            </div>
        );
    } else { return(    
        <div className="container">
        <div className="row mt-5">
            <div className="col-12 heading">
             <h3>List of All books</h3>
             <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name of Book</th>
            <th>ISBN number</th>
            <th>Authors</th>
            <th>Copies available</th>
            {this.props.isAdmin?(<th>Edit / <br/>Delete</th>):(<React.Fragment/>)}
          </tr>
        </thead>
        <tbody>
            {list}
        </tbody>
        </Table>
            </div>
        </div>
    </div>
        );
    }}
}

export default Booklist;