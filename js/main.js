var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var pressedkeys = [];

document.addEventListener("keydown", function(e){
  //e.preventDefault();
  var key = String.fromCharCode(e.keyCode).toLowerCase();
  if( pressedkeys.indexOf(key) == -1 ){
    pressedkeys.push(key);
  }
});

document.addEventListener("keyup", function(e){
  var key = String.fromCharCode( e.keyCode ).toLowerCase();
  while( pressedkeys.indexOf( key ) > -1 ){
    //weird js to remove unpressed keys from array
    var index = pressedkeys.indexOf( key );
    var firsthalf = pressedkeys.splice( 0, index );
    var secondhalf = pressedkeys.splice( index + 1 );
    pressedkeys = firsthalf.concat(secondhalf);
  }
});

var controller = function(){
  var obj = null;
  this.mappings = {
    'w' : function(){
      obj.vy -= 10;
    },
    'a': function(){
      obj.vx -= 10;
    },
    's': function(){
      obj.vy += 10;
    },
    'd': function(){
      obj.vx += 10;
    }
  };
  this.setObject = function( o ){
    obj = o;
  }
};

var obj = function(){
  this.x = 0;
  this.y = 0;
  this.width = 50;
  this.height = 50;
  this.vx = 5;
  this.vy = 5;
  this.background = "black";
  this.render = function( context ){
    context.beginPath();
    context.fillStyle = this.background;
    context.fillRect( this.x, this.y, this.width, this.height );
    context.stroke();
  };
  this.addController = function( c ){
    this.controller = c;
  };
};

var scene = function(){
  this.fps = 50;
  this.interval = 1 / this.fps * 1000;
  this.children = [];
  this.now = 0;
  this.past = 0;
  this.diff = 0;
  this.friction = 0.75;
  this.context = ctx;
  this.background = "grey";
  this.addChild = function( obj ){
    this.children.push( obj );
  };
  this.setContext = function( context ){
    this.context = context;
  };
  this.clear = function(){
    //this.context.clearRect( 0, 0, canvas.width, canvas.height );
    this.context.beginPath();
    this.context.fillStyle = this.background;
    this.context.fillRect( 0, 0, canvas.width, canvas.height);
    this.context.stroke();

  };
  this.tick = function(){
    this.clear();
    this.now = new Date().getTime();
    if( this.past > 0 ) {
      this.diff = this.now - this.past;
    }
    else {
      this.diff = this.interval;
    }
    this.past = this.now;
    for( var i = 0; i < this.children.length; i++ ){
      var child = this.children[i];

      //make adjustments based on user input first
      if( child.hasOwnProperty('controller') ){
        for( var j in pressedkeys ){
          var key = pressedkeys[j];
          if (child.controller.mappings.hasOwnProperty(key)){
            child.controller.mappings[key]();
          }
        }
      }

      // then change according to velocity
      // multiply by ratio of actual difference to ideal difference to compensate
      // for slight timing inaccuracies
      child.x += child.vx * ( this.diff / this.interval );
      child.y += child.vy * ( this.diff / this.interval );
      child.vx *= this.friction;
      child.vy *= this.friction;

      // out of bounds checks
      if( child.x < 0 || (child.x + child.width) > canvas.width ) {
        child.vx *= -1;
        child.x = child.x < 0 ? 0 : (canvas.width - child.width);
      }
      if( child.y < 0 || (child.y + child.height) > canvas.height ) {
        child.vy *= -1;
        child.y = child.y < 0 ? 0 : (canvas.height - child.height);
      }

      for( var j = i + 1; j < this.children.length; j++ ){
        var child2 = this.children[j];
        if( collides( child, child2 ) ){
          child2.vx = child.vx;
          child2.vy = child.vy;
          child.vx = 0;
          child.vy = 0;

          child.x += child.vx;
          child.y += child.vy;
          child2.x += child2.vx;
          child2.y += child2.vy;
        }
      }
      child.render( ctx );
    }
  };
};

var collides = function( obj1, obj2 ){
  if( (obj1.x + obj1.width > obj2.x) && (obj2.x + obj2.width > obj1.x) ){
    if( (obj1.y + obj1.height > obj2.y) && (obj2.y + obj2.height > obj1.y) ){
      return true;
    }
  }
  else {
    return false;
  }
};

var fixOffset = function( obj1, obj2 ){
  if( obj2.x > obj1.x + obj1.width/2 && obj2.x < obj1.x + obj1.width){

  }
};

var background = new scene();
var player = new obj();
var testObj = new obj();
var keyboard = new controller();
player.addController( keyboard );
keyboard.setObject(player);
background.addChild(player);
background.addChild(testObj);
testObj.x = 500;
testObj.y = 500;
setInterval( function(){window.requestAnimationFrame(function(){background.tick()});}, background.interval )
