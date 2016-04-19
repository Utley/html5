var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var pressedkeys = [];
var controls = {
  'up': 'w',
  'right': 'd',
  'down': 's',
  'left': 'a'
}
var index;

var sendUserInput = function(){
  var datagram = [];
  for( var i in controls ){
    if( pressedkeys.indexOf(controls[i]) > -1 ){
      datagram.push(i);
    }
  }
  socket.emit('user input', {'keys': datagram});
};

document.addEventListener("keydown", function(e){
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

var background = new scene();


socket.on('tick', function( data ){
  background.children = data;
});

background.setCanvas(canvas);
setInterval( function(){window.requestAnimationFrame(function(){background.tick()});}, background.interval )
setInterval( sendUserInput, 20 );
