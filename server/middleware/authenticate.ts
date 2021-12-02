export {}
import {Request, Response,NextFunction} from "express"
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var GoogleTokenStrategy = require('passport-google-id-token');

passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
  async function(parsedToken: any, googleId:any, done:any) {
    const userPayload = {
        email: parsedToken?.payload?.email,
        firstName: parsedToken?.payload?.given_name,
        lastName: parsedToken?.payload?.family_name,
    }
    try {
        const user = await User.findOrCreate({ googleId: googleId }, function (err:any, user:any) {
            return done(err, user);
          });
    } catch(e) {
        done(e)
    }   
  }
));

exports.local=passport.use(new LocalStrategy(User.authenticate()));

// For sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user:any) {
    return jwt.sign(user, 'QUANG',
        {expiresIn: 3600});
};

var opts:any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'QUANG';

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload:any, done:any) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err:any, user:any) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function (req:any, res:Response, next:NextFunction){
    if(req.user.admin){
        next();
    }else{
        let err:any = new Error('You are not authorized!');
        err.status = 403;
        return next(err);
    }
};