var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var physics = require('./physics');

app.use( '/js', express.static(__dirname + '/js'));
app.use( '/img', express.static(__dirname + '/img'));

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
var bounce = .75;

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
  var keys = Object.keys(children);

  for( var i = 0; i < keys.length; i++ ){
    var key1 = keys[i];
    for( var j = keys.length - 1; j > -1; j-- ){
      if( i == j ){
        break;
      }
      var key2 = keys[j];
      var obj1 = children[key1];
      var obj2 = children[key2];
      if( physics( obj1, obj2 ) ){
        //do collision stuff here
        var cx1 = obj1.x + obj1.width / 2;
        var cx2 = obj2.x + obj2.width / 2;
        var xdist = cx2 - cx1;
        var hw1 = obj1.width / 2;
        var hw2 = obj2.width / 2;
        var xoverlap = hw1 + hw2 - Math.abs(xdist);
        xoverlap = xdist < 0 ? xoverlap : -xoverlap;

        var cy1 = obj1.y + obj1.height / 2;
        var cy2 = obj2.y + obj2.height / 2;
        var ydist = cy2 - cy1;
        var hh1 = obj1.height / 2;
        var hh2 = obj2.height / 2;
        var yoverlap = hh1 + hh2 - Math.abs(ydist);
        yoverlap = ydist < 0 ? yoverlap : -yoverlap;
        if( Math.abs( yoverlap ) < Math.abs( xoverlap ) ){
          obj1.vy +=  yoverlap * bounce;
          obj2.vy += -yoverlap * bounce;
        }
        else{
          obj1.vx +=  xoverlap * bounce;
          obj2.vx += -xoverlap * bounce;
        }
      }
    }
    children[key1].x  += children[key1].vx;
    children[key1].y  += children[key1].vy;
    children[key1].vx *= (1-friction);
    children[key1].vy *= (1-friction);
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
