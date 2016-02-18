var controller = function(){
  var obj = null;
  this.mappings = {
    'w' : function(){
      obj.vy -= obj.thrust / obj.mass;
    },
    'a': function(){
      obj.vx -= obj.thrust / obj.mass;
    },
    's': function(){
      obj.vy += obj.thrust / obj.mass;
    },
    'd': function(){
      obj.vx += obj.thrust / obj.mass;
    }
  };
  this.setObject = function( o ){
    obj = o;
  }
};
