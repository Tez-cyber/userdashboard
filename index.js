const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan')
require("dotenv").config()
const mongoose = require('mongoose');
const uuid = require('uuid')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const app = express()


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// var userRouter = require('./routes/index');
// app.use('/', userRouter);
//catch 404 and forward to  error handler
app.use(function(req,res,next){
    next(createError(404));
});

//error-handler
app.use(function(err,req,res,next) {
    //set locals,only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
})


const store = new MongoDBStore({
    uri:  process.env.MONGO_URI,
    collection: 'sessions'
})
app.use(session({
    cookie: {
        maxAge : 864e5
    },
    secret : process.env.SESSION_SECRET,
    resave : false,
    store: store,
    saveUninitialized: true,
    unset: 'destroy',
    genid: (req) => {
        return uuid.v4()
    }
}))
const CONFIG = {
    uri: process.env.MONGO_TEST,
    OPTIONS: { 
        useNewUrlParser : true ,
        useCreateIndex: true ,
        useUnifiedTopology : true,
    }
}
mongoose.connect(CONFIG.uri, CONFIG.OPTIONS)
.then(() => {
    console.log("DB CONNECTED")
}).catch(() => {
    console.log("UNABLE to connect to DB")
})

app.use(cookieParser())

module.exports = app