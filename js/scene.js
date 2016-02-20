var scene = function(){
  this.fps = 50;
  this.interval = 1 / this.fps * 1000;
  this.children = [];
  this.now = 0;
  this.past = 0;
  this.diff = 0;
  this.friction = 0.95;
  this.context = null;
  this.canvas = null;
  this.background = "grey";
  this.addChild = function( obj ){
    this.children.push( obj );
  };
  this.setCanvas = function( canvas ){
    this.canvas = canvas;
    this.context= canvas.getContext('2d');
  }
  this.clear = function(){
    //this.context.clearRect( 0, 0, canvas.width, canvas.height );
    this.context.beginPath();
    this.context.fillStyle = this.background;
    this.context.fillRect( 0, 0, canvas.width, canvas.height);
    this.context.stroke();
  };
  this.tick = function(){
    socket.emit('user input', {'index': index, 'keys': pressedkeys});
    this.clear();
    for( var i in this.children ){
      var child = this.children[i];
      render( child );
    }
  };
};

var render = function(o){
  ctx.beginPath();
  ctx.fillStyle = o.background;
  ctx.fillRect( o.x, o.y, o.width, o.height );
  ctx.stroke();
}
