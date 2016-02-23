var collides = function( obj1, obj2 ){
  if( obj1.x + obj1.width > obj2.x ){
    if( obj2.x + obj2.width > obj1.x ){
      if( obj1.y + obj1.height > obj2.y ){
        if(obj2.y + obj2.height > obj1.y ){
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = collides;
