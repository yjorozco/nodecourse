var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var authenticate = require('./authenticate');
var config = require('./config');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

var routes = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRoute');
var promoRouter = require('./routes/promoRoute');
var leaderRouter = require('./routes/leaderRoute');
<<<<<<< HEAD
var favoriteRouter = require('./routes/favoriteRoute');
=======
>>>>>>> afd6707a98d922fbe87c16d9c565366040776b7a

var app = express();


// Secure traffic only
<<<<<<< HEAD
/*app.all('*', function(req, res, next){
=======
app.all('*', function(req, res, next){
>>>>>>> afd6707a98d922fbe87c16d9c565366040776b7a
    console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
  if (req.secure) {
    return next();
  };

 res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
<<<<<<< HEAD
});*/
=======
});
>>>>>>> afd6707a98d922fbe87c16d9c565366040776b7a

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
//var User = require('./models/user');
app.use(passport.initialize());
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leadership',leaderRouter);
<<<<<<< HEAD
app.use('/favorites',favoriteRouter);
=======
>>>>>>> afd6707a98d922fbe87c16d9c565366040776b7a

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;