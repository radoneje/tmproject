var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/adminRouter');
const {MongoClient} = require('mongodb');
const mongo = new MongoClient("mongodb://localhost");
const session = require('express-session');
const MongoDBStore = require('express-mongodb-session')(session);

var app = express();
const store = new MongoDBStore({
  existingConnection: mongo,
  collection: 'mySessions'
});
app.use(require('express-session')({
  secret: 'greg*nbmvvervreb',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7*31 // 1 mounth
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
app.mongo=mongo;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next)=>{
  req.mongo=mongo;
  req.db=mongo.db('tmproject')
  next();
});
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
