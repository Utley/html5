var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use( '/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var obj = function(){
  this.vx = 0;
  this.vy = 0;
  this.thrust = 3;
  this.mass = 1;
  this.x = 0;
  this.y = 0;
  this.width = 20;
  this.height = 20;
  this.background = "black";
}

var children = {};
var friction = 0.15;
io.on('connection', function( socket ){
  console.log('user connected');
  children[socket.id] = new obj();
  var player = children[socket.id];
  socket.on('user input', function(data){
    if(data.keys.indexOf('w') > -1){
      player.vy -= player.thrust / player.mass;
    }
    if(data.keys.indexOf('a') > -1){
      player.vx -= player.thrust / player.mass;
    }
    if(data.keys.indexOf('s') > -1){
      player.vy += player.thrust / player.mass;
    }
    if(data.keys.indexOf('d') > -1){
      player.vx += player.thrust / player.mass;
    }
  });
  socket.on('disconnect', function(){
    delete children[socket.id];
  });
});

var tick = function(){
  for(var i in children){
    children[i].x += children[i].vx;
    children[i].y += children[i].vy;
    children[i].vx *= (1-friction);
    children[i].vy *= (1-friction);
  }
  io.emit('tick', children);
};
var fps = 50;
var interval = 1/fps * 1000;
setInterval(tick, interval);
var port = 3000;
http.listen(port, function(){
  console.log('Listening on port ' + port);
});

module.exports = app;
