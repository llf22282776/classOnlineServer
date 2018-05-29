var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var filterRoute = require('./routes/filterRouter');
var usersRouter = require('./routes/users');
var classRouter = require('./routes/classRouter');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//cooikes过滤等等处理//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('classOnline'));//签名cookies
app.use(express.static(path.join(__dirname, 'public')));//视频图片都在这里了
//过滤器，没有cookie将被过滤
app.use(filterRoute);
//其他,没有被过滤的将进入这里
app.use('/users', usersRouter);
app.use('/class', classRouter);

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


app.listen(3000);
module.exports = app;