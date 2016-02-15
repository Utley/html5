var canvas = document.getElementById("canvas");
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
background.setCanvas(canvas);
testObj.x = 500;
testObj.y = 500;
setInterval( function(){window.requestAnimationFrame(function(){background.tick()});}, background.interval )
