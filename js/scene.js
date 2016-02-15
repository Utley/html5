var scene = function(){
  this.fps = 50;
  this.interval = 1 / this.fps * 1000;
  this.children = [];
  this.now = 0;
  this.past = 0;
  this.diff = 0;
  this.friction = 0.75;
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
      child.render( this.context );
    }
  };
};
