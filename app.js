var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var physics = require('./physics');

app.use( '/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var obj = function(){
  this.vx = 0;
  this.vy = 0;
  this.thrust = 3;
  this.mass = 4;
  this.x = 0;
  this.y = 0;
  this.width = 40;
  this.height = 40;
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
  var entries = [];
  for(var i in children){
    entries.push(children[i]);
  }
  for(var i in entries){
    for(var j in entries.reverse()){
      if( i == j ){
        break;
      }
      var obj1 = entries[i];
      var obj2 = entries[j];
      if( physics( obj1, obj2 )){
        var initvx1 = obj1.vx;
        var initvy1 = obj1.vy;
        if( Math.abs(obj1.vx) > Math.abs(obj2.vx) ){
          obj2.x -= (obj1.x - obj2.x);
        }
        else {
          obj1.x -= (obj2.x - obj1.x);
        }

        obj1.vx = (obj1.mass - obj2.mass) / (obj1.mass + obj2.mass) + (2 * obj2.mass) / (obj1.mass + obj2.mass) * obj2.vx;
        obj2.vx = (2 * obj1.mass) / (obj1.mass + obj2.mass) * initvx1 - (obj1.mass - obj2.mass) / (obj1.mass + obj2.mass) * obj2.vx;
        obj1.vy = (obj1.mass - obj2.mass) / (obj1.mass + obj2.mass) + (2 * obj2.mass) / (obj1.mass + obj2.mass) * obj2.vy;
        obj2.vy = (2 * obj1.mass) / (obj1.mass + obj2.mass) * initvy1 - (obj1.mass - obj2.mass) / (obj1.mass + obj2.mass) * obj2.vy;

      }
    }
    entries[i].x += entries[i].vx;
    entries[i].y += entries[i].vy;
    entries[i].vx *= (1-friction);
    entries[i].vy *= (1-friction);
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
