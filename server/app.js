require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const RateLimit = require('express-rate-limit');

require('./authStrategies/facebook');
require('./authStrategies/local');

const signup = require('./routes/signup');
const login = require('./routes/login');
const logout = require('./routes/logout');
const activate = require('./routes/activate');
const auth = require('./routes/auth');
const config = require('./config');
const index = require('./routes/index');
const resetPasswordHandler = require('./routes/resetPasswordHandler');
const resetPasswordEmail = require('./routes/resetPasswordEmail');
const protected = require('./routes/protected');
const graphqlProxy = require('./routes/graphqlProxy');

// passport imports
const passport = require('passport');
const session = require('express-session');

// mongo imports
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const { mongoose } = require('./db/mongoose');

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieParserSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(limiter);

app.use('/', index);
app.use('/auth', auth);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/activate', activate);
app.use('/resetpasswordemail', resetPasswordEmail);
app.use('/resetpasswordhandler', resetPasswordHandler);
app.use('/protected', protected);
app.use('/graphql', graphqlProxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
