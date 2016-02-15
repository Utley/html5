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
