export {};

const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
var passport = require('passport');
var authenticate = require('./middleware/authenticate');
import {Request, Response, NextFunction} from "express"

// Loading routers
const bookRouter = require('./routes/book.route');
const userRouter = require('./routes/user.route');
const issueRouter = require('./routes/issue.route');
const app= express();

app.use(function(req:Request, res:Response, next:NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Bodyparser Middleware
app.use(bodyParser.json());

// DB config 
const mongoURI:String = require('./config/keys').mongoURI;

// Connect to mongo
mongoose.connect("mongodb://AsianSausage:Quangpro1995@cluster0-shard-00-00.fjnrj.mongodb.net:27017,cluster0-shard-00-01.fjnrj.mongodb.net:27017,cluster0-shard-00-02.fjnrj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b8s458-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {console.log("MongoDB Connected");})
.catch((err:any) => console.log(err));

mongoose.set('useCreateIndex', true);
app.use(passport.initialize());

// Use routes
app.use('/api/books',bookRouter);
app.use('/api/users',userRouter);
app.use('/api/issues',issueRouter);
app.post('/auth/google',passport.authenticate('google-id-token'),
function (req:any, res:any) {
    // do something with req.user
    res.send(req.user? 200 : 401);
  }
);
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req:Request, res:Response, next:NextFunction) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Server started running on port ${port}`));