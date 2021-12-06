const User = require('../models/user.model');
import {Request, Response, NextFunction} from "express"
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken')

//GET ALL USERS
exports.getAllUser = async (req:Request, res:Response, next: NextFunction) => {
    User.find({})
      .then((users:JSON)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(users);
      },(err:Error)=>(next(err)))
      .catch((err:Error)=>(next(err)))
}

//UPDATE USER
exports.updateUser = async (req:Request, res:Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.params.userId,{
      $set: req.body
},{new: true})
  .then((user:JSON) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(user);
}, (err:Error) => next(err))
  .catch((err:Error) => res.status(400).json({success: false}));
}

//CHANGE PASSWORD
exports.changePassword = async (req:Request, res:Response, next: NextFunction) => {
    await User.findById(req.params.userId)
    .then((user:any) => {
    if(user&&!user.admin){
      user.setPassword(req.body.password, function(){
        user.save();
         res.status(200).json({message: 'password changed successfully'});
    });
    }
    else if(!user){
      res.status(500).json({message: "User doesn't exist"});      
    }
    else{
      res.status(400).json({message: "Password of an admin can't be changed this way.\nContact the webmaster"});
    }
  }, (err:Error) => next(err))
  .catch((err:Error) => res.status(400).json({message: 'Internal Server Error'}));
}

//SIGN UP
exports.signUp = async (req:Request, res:Response, next: NextFunction) => {
    await User.register(new User({username: req.body.username,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      roll : req.body.roll }), 
      req.body.password, (err:any, user:any) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        else {      
          user.save((err:any, user:any) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return ;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!'});
            });
          });
        }
      });
};

exports.logIn = async (req:any, res:Response, next: NextFunction) => {
    await passport.authenticate('local', (err:Error, user:any, info:any) => {
      if (err)
        return next(err);
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: info});
      }
      req.logIn(user, (err:Error) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
        }
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Successful!', token: token, userinfo: req.user});
        console.log(req.user + "         this is body")
        console.log(token + "            this is token")
      }); 
    }) (req, res, next); // function call IIFE
}

exports.logOut = async (req:any, res:Response, next: NextFunction) => {
    if (req.session) {
      await req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      let err:any = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
}

exports.checkJWT = async (req:any, res:Response, next: NextFunction) => {
    passport.authenticate('jwt', {session: false}, (err:Error, user:any, info:any) => {
      if (err)
        return next(err);
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT invalid!', success: false, err: info});
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT valid!', success: true, user: user});
      }
    }) (req, res);
}

exports.logGoogle = async (req:any, res:Response, next: NextFunction) => {
  
      const {email,id,firstname,lastname, admin} = req.user as any
      try {
      var token = jwt.sign(
        {email,id,firstname, lastname, admin},"QUANG",{expiresIn:"1h"}
      )
      res.statusCode = 200;
      res.json({success: true, status: 'Login Successful!', token: token, userinfo: req.user});
      console.log(res)
      console.log(token + "         this is token")
      console.log(req.user + "         this is body")
      
    } catch(e) {
        return next(e)     
    }
}

  
