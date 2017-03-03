var dishRouter = require('./dishRoute.js');
var leaderRouter = require('./leaderRoute.js');
var promoRouter = require('./promoRoute.js');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leadership',leaderRouter);

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log('Server running at http://${hostname}:${port}/');
});