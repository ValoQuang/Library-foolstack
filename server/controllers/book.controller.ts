const Books=require('../models/book.model');
import {Request, Response, NextFunction} from "express"

//ROUTE "/"
//get all books
exports.getAllBook = async (req:Request, res:Response, next:NextFunction) => {
    await Books.find(req.query)
    .sort({name: 'asc'})
    .then((books:any)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(books);
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err)))
}

//create book
exports.createBook = async (req:Request, res:Response, next:NextFunction) => {
    await Books.create(req.body)
    .then((book:JSON)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(book);
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err))) 
}
//GET 1 BOOK
exports.getBook = async (req:Request, res:Response, next:NextFunction) => {
    await Books.findById(req.params.bookId)
    .then((book:JSON)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(book);
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err)));
}

//FIND BY ID AND UPDATE
exports.findByIdAndUpdate = async (req:Request, res:Response, next:NextFunction) => {
    await Books.findByIdAndUpdate(req.params.bookId,{
        $set: req.body
    },{new: true})
    .then((book:JSON) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(book);
   }, (err:Error) => next(err))
   .catch((err:Error) => res.status(400).json({success: false}));
   }

// DELETE 
exports.deleteBook = async (req:Request, res:Response, next:NextFunction) => {
    await Books.findByIdAndRemove(req.params.bookId)
    .then((resp:JSON) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({_id: req.params.bookId,success: true});
    }, (err:Error) => next(err))
    .catch((err:Error) =>  res.status(400).json({success: false}));
}