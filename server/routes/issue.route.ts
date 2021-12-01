export {}
const express = require('express');
const bodyParser = require('body-parser');
const issueRouter = express.Router();
const authenticate = require('../middleware/authenticate');
const cors = require('./cors');
import {Request, Response, NextFunction} from "express"
const issueController = require("../controllers/issue.controller")

issueRouter.use(bodyParser.json());

issueRouter.route('/')
.options(cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); })

//get student info
.get(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin, issueController.getStudentInfo)

//CREATE ISSUE BOOK TO STUDENT
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, issueController.issueBook )

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next: NextFunction) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /issues');
})
//DELETE ISSUE BOOK TO STUDENT 
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, issueController.deleteIssue)

//ROUTE /STUDENT/
issueRouter.route('/student/')
.options(cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); })
//GET STUDENT
.get(cors.corsWithOptions,authenticate.verifyUser, issueController.getStudent)

//ROUTE ISSUE WITH ID
issueRouter.route('/:issueId')
.options(cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser, issueController.getIssue )
//CREATE personal Issue 
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next: NextFunction) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /issues/'+ req.params.issueId);
})
//DELETE ISSUE
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next: NextFunction) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /issues/'+ req.params.issueId);
})
//UPDATE ISSUE
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,issueController.updateIssue)


module.exports = issueRouter;


