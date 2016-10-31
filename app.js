var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var readline = require('readline');
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
  this.points = [[0,40],[40,40],[40,0],[0,0]];
  this.width = 40;
  this.height = 40;
  this.background = "black";
  this.keys = [];
}

var updateLocation = function(){
  for(var i in this.points){
    this.points[i][0] += this.vx;
    this.points[i][1] += this.vy;
  }
}
var children = {};
var friction = 0.15;
var bounce = 0.75;
var width = 1024;
var height = 1024;

io.on('connection', function( socket ){
  children[socket.id] = new obj();
  var player = children[socket.id];
  socket.on('user input', function(data){
    player.keys = data.keys;
  });
  socket.on('disconnect', function(){
    delete children[socket.id];
  });
});

var tick = function(){
  var keys = Object.keys(children);

  for( var i = 0; i < keys.length; i++ ){
    var key1 = keys[i];
    var obj1 = children[key1];
    //take user input into account first
    var acceleration = obj1.thrust / obj1.mass;
    if(obj1.keys.indexOf('up') > -1){
      obj1.vy -= acceleration;
    }
    if(obj1.keys.indexOf('left') > -1){
      obj1.vx -= acceleration;
    }
    if(obj1.keys.indexOf('down') > -1){
      obj1.vy += acceleration;
    }
    if(obj1.keys.indexOf('right') > -1){
      obj1.vx += acceleration;
    }
    if( obj1.x < 0 || obj1.x + obj1.width > width ){
      obj1.vx *= -1;
    }
    if( obj1.y < 0 || obj1.y + obj1.height > height ){
      obj1.vy *= -1;
    }
    //compare i to other keys
    for( var j = keys.length - 1; j > -1; j-- ){
      if( i == j ){
        break;
      }
      var key2 = keys[j];
      var obj2 = children[key2];

      if( physics.trueCollides( obj1, obj2 ) ){
        console.log("colliding!");

        //calculate x and y overlap
        var center_x1 = obj1.x + obj1.width / 2;
        var center_x2 = obj2.x + obj2.width / 2;

        //find the distance between the centers
        var xdist = center_x2 - center_x1;
        var half_width1 = obj1.width / 2;
        var half_width2 = obj2.width / 2;
        var xoverlap = half_width1 + half_width2 - Math.abs(xdist);
        xoverlap = xdist < 0 ? xoverlap : -xoverlap;

        var center_y1 = obj1.y + obj1.height / 2;
        var center_y2 = obj2.y + obj2.height / 2;
        var ydist = cy2 - cy1;
        var half_height1 = obj1.height / 2;
        var half_height2 = obj2.height / 2;
        var yoverlap = hh1 + hh2 - Math.abs(ydist);
        yoverlap = ydist < 0 ? yoverlap : -yoverlap;

        //use the bigger overlap to determine the resulting direction of both objects
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

    children[key1].x += children[key1].vx;
    children[key1].y += children[key1].vy;
    for(var i in children[key1].points){
      children[key1].points[i][0] += children[key1].vx;
      children[key1].points[i][1] += children[key1].vy;
    }
    children[key1].vx *= (1-friction);
    children[key1].vy *= (1-friction);
  }
  io.emit('tick', children);
};

var ticksPerSecond = 50;
var interval = 1/ticksPerSecond * 1000;
setInterval(tick, interval);

var port = 3000;
http.listen(port, function(){
  console.log('Listening on port ' + port);
});

module.exports = app;
