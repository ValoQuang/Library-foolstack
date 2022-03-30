const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userController = require("../controllers/user.controller")
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
import {Request, Response} from "express"
const cors = require('./cors');

router.use(bodyParser.json());
/* GET users listing. */
router.options('*', cors.corsWithOptions, (req:Request, res:Response) => { res.sendStatus(200); 
  res.setHeader('Access-Control-Allow-Credentials', 'true');} )

//GET ALL USERS
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, userController.getAllUser);

//UPDATE USER WITH ID
router.put('/:userId',cors.corsWithOptions,authenticate.verifyUser, userController.updateUser)

//CHANGE PASSWORD
router.put('/password/:userId',cors.corsWithOptions,authenticate.verifyUser, userController.changePassword)

//SIGN UP 
router.post('/signup',cors.corsWithOptions, userController.signUp);

//SIGN IN
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), userController.logIn);

router.get('/logout',cors.cors, userController.logOut);

router.get('/checkJWTtoken', cors.corsWithOptions, userController.checkJWT)

//GOOGLE ROUTE IN USER
router.post('/google',cors.corsWithOptions,passport.authenticate('google-id-token', {session:false}),userController.logGoogle);
module.exports = router;
   