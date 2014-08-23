/*
var express = require('express')
  , http = require('http')
  , connect = require('connect')
  , sockets = require('./sockets');
*/

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/../static'));

var server = app.listen(3000);
var io = require("socket.io").listen(server);

require("./sockets").init(io);

/*
var staticServer = connect()
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser());
 
var app = express();

app.configure(function() {
  app.use(staticServer);
  app.use(express.errorHandler());
  app.use(express.bodyParser());
});

var server = http.createServer(app);

var cio = require('socket.io').listen(server);

server.listen(8000);

sockets.init(cio);
*/
