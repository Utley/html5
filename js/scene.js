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
  this.width = 1024;
  this.height = 1024;
  this.addChild = function( obj ){
    this.children.push( obj );
  };
  this.setCanvas = function( canvas ){
    this.canvas = canvas;
    this.context= canvas.getContext('2d');
  }
  this.clear = function(){
    this.context.beginPath();
    this.context.fillStyle = this.background;
    this.context.fillRect( 0, 0, canvas.width, canvas.height);
    this.context.stroke();
  };
  this.tick = function(){
    this.clear();
    for( var i in this.children ){
      var child = this.children[i];
      var me = this.children['/#' + socket.id];
      var myx = me.x;
      var myy = me.y;
      var renderx = -(myx - child.x) + this.canvas.width / 2;
      var rendery = -(myy - child.y) + this.canvas.height / 2;
      var renderobj = {
        "x" : renderx,
        "y" : rendery,
        "width": child.width,
        "height": child.height
      }
      render( renderobj );
      this.drawSurroundings();
    }
  };
  this.drawSurroundings = function(o){
    ctx.beginPath();
    var me = this.children['/#' + socket.id];
    var myx = me.x;
    var myy = me.y;
    var lx = (this.canvas.width /  2) - myx;
    var ty = (this.canvas.height / 2) - myy;
    var by = this.height - (myy) + this.canvas.height / 2;
    var rx = this.width -  (myx) + this.canvas.width  / 2;
    ctx.moveTo( lx, ty );
    ctx.lineTo( lx, by );
    ctx.lineTo( rx, by );
    ctx.lineTo( rx, ty );
    ctx.lineTo( lx, ty );
    ctx.stroke();
  }
};
var defaultimg = document.getElementById('default');
var render = function(o){
  ctx.beginPath();
  ctx.drawImage( defaultimg, o.x, o.y, o.width, o.height );
  ctx.stroke();
}
