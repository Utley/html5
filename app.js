var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function( socket ){
  console.log('user connected');
});

http.listen(3000, function(){
  console.log('listeneing on 300)');
});

module.exports = app;
