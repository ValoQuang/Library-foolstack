export {}
const express = require('express');
const bodyParser = require('body-parser');
const bookRouter = express.Router();
const authenticate=require('../middleware/authenticate');
const cors = require('./cors');
const bookController = require("../controllers/book.controller")
import {Request, Response, NextFunction} from "express"

bookRouter.use(bodyParser.json());

//ROUTE "/"
bookRouter.route('/')
.options(cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); })
//get all book
.get(cors.corsWithOptions, bookController.getAllBook)
//create book
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, bookController.createBook)
//update book on route "/"
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next:NextFunction) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next:NextFunction) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /books');
});
//ROUTE "/:bookId"
bookRouter.route('/:bookId')
.options(cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); 
    res.setHeader('Access-Control-Allow-Credentials', 'true')})
//GET 1 BOOK
.get(cors.corsWithOptions, bookController.getBook)
//CREAATE BOOK 
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:Request, res:Response, next:NextFunction) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /books/'+ req.params.bookId);
})
//FIND BY ID AND UPDATE
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, bookController.findByIdAndUpdate)
//DELETE BOOK WITH ID 
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, bookController.deleteBook);


module.exports = bookRouter;