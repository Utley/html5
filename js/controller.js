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
