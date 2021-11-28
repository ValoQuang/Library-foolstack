import {Request, Response, NextFunction} from "express"
var Issue = require('../models/issue.model');
var Books = require('../models/book.model');
var Users = require('../models/user.model');
var express = require('express');
const bodyParser = require('body-parser');
const issueRouter = express.Router();

issueRouter.use(bodyParser.json());

//GET STUDENT INFO 
exports.getStudentInfo = async (req:Request, res:Response, next: NextFunction) => {
    await Issue.find({})
    .populate('student')
    .populate('book')
      .then((issues:JSON)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(issues);
      },(err:Error)=>(next(err)))
      .catch((err:Error)=>(next(err)))
}
//CREATE ISSUE BOOK TO STUDENT
exports.issueBook = async (req:Request, res:Response, next: NextFunction) => {
    await Books.findById(req.body.book)
    .then((requiredBook:any)=>{
        Users.findById(req.body.student)
        .then((requiredUser:any)=>{
            if(!requiredBook) {
                let err:any = new Error("Book doesn't exist");
                err.status = 400;
                return next(err);
           }
            else if(!requiredUser){
                 let err:any = new Error("Student doesn't exist");
                        err.status = 400;
                        return next(err);
            }
            else if(requiredBook._id&&requiredUser._id) {
                Issue.find({
                   student: req.body.student 
                })
            
                .then((issues:any)=>{
                    let notReturned:any = issues.filter((issue:any)=>(!issue.returned));
                    if(notReturned && notReturned.length>=3){
                        let err:any = new Error(`The student has already issued 3 books. Please return them first`);
                        err.status = 400;
                        return next(err);
                    }
                    else{
                        if(requiredBook.copies>0){
                        Issue.create(req.body, function(err:any, issue:any) {
                            if (err) return next(err)
                            Issue.findById(issue._id)
                            .populate('student')
                            .populate('book')                        
                            .exec(function(err:any, issue:any) {
                              if (err) return next(err)
                              Books.findByIdAndUpdate(req.body.book,{
                                $set: {copies: (requiredBook.copies-1)}
                            },{new: true})
                            .then((book:JSON) => {
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(issue);
            
                           }, (err:Error) => next(err))
                           .catch((err:Error) => res.status(400).json({success: false}));
            
                            })})
                    }
                    else {
                        console.log(requiredBook);
                        let err:any = new Error(`The book is not available. You can wait for some days, until the book is returned to library.`);
                        err.status = 400;
                        return next(err);
                    }
                    }
                })
                .catch((err:Error)=>(next(err))) ;
            }
        },(err:Error)=>(next(err)))
        .catch((err:Error)=>(next(err)))                  
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err))) 
}
//DELETE ISSUE BOOK TO STUDENT 
exports.deleteIssue = async (req:Request, res:Response, next: NextFunction) => {
    await Issue.remove({})
    .then((resp:JSON) => {
        console.log("Removed All Issue");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err:Error) => next(err))
    .catch((err:Error) => next(err));
}
//GET STUDENT 
exports.getStudent = async (req:any, res:Response, next: NextFunction) => {
    await Issue.find({student: req.user._id})
    .populate('student')
    .populate('book')
    .then((issue:JSON)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(issue);
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err)))
}

//ROUTE ISSUE WITH ID
//GET ISSUE 
exports.getIssue = async (req:any, res:Response, next: NextFunction) => {
    await Issue.findById(req.params.issueId)
    .populate('student')
    .populate('book')
    .then((issue:any)=>{
        if(issue&&(issue.student._id===req.user._id||req.user.admin))
       { res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(issue);
       }
       else if(!issue){
        let err:any = new Error(`Issue not found`);
        err.status = 404;
        return next(err);
    }
       else{
        let err:any = new Error(`Unauthorised`);
        err.status = 401;
        return next(err);
       }
    },(err:Error)=>(next(err)))
    .catch((err:Error)=>(next(err)))
}
//UPDATE ISSUE
exports.updateIssue = async (req:Request, res:Response, next: NextFunction) => {
    await Issue.findById(req.params.issueId)
    .then((issue:any)=>{
    Books.findById(issue.book)
    .then((requiredBook:any)=>{
        Issue.findByIdAndUpdate(req.params.issueId,{
            $set: {returned: true}
        },{new: true})
        .populate('student')
        .populate('book')
        .then((issue:any) => {
            Books.findByIdAndUpdate(issue.book,{
                $set: {copies: (requiredBook.copies+1)}
            },{new: true})
            .then((book:any) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(issue);
            }, (err:Error) => next(err))
            .catch((err:Error) => res.status(400).json({success: false,message: "Book not updated"}));
       }, (err:Error) => next(err))
       .catch((err:Error) => res.status(400).json({success: false,message: "Issue not Updated"}));
    }, (err:Error) => next(err))
    .catch((err:Error) => res.status(400).json({success: false,message: "Book not found"}));
   }, (err:Error) => next(err))
   .catch((err:Error) => res.status(400).json({success: false,message: "Issue not found"}))
}