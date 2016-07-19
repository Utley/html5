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

var trueCollides = function( obj1, obj2 ){
  //for each line in obj1, find the perpendicular
  for ( var i in obj1.points ){
    //get the next point
    var p1 = obj1.points[i + 1] || obj1.points[0];
    var p2 = obj1.points[i];
    console.log("p1 : " + p1);
    console.log("p2 : " + p2);
    console.log("obj.points: " + obj1.points);
    var deltaY = p2[1] - p1[1];
    console.log("delta y: " + deltaY);
    var deltaX = p2[0] - p1[0];
    console.log("delta x: " + deltaX);
    var perpendicular = [-deltaY, deltaX];
    var perpMagnitude = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
    console.log("perpendicular magnitude: " + perpMagnitude);
    perpendicular[0] = -deltaY / perpMagnitude;
    perpendicular[1] = deltaX  / perpMagnitude;
    console.log(perpendicular[0]);
    console.log(perpendicular[1]);
    //project each of obj1's points onto the perpendicular
    //by finding the dot product
    var min1 = Infinity;
    var max1 = 0;
    for( var x in obj1.points ){
      var scalar = obj1.points[x][0] * perpendicular[0] + obj1.points[x][1] * perpendicular[1];
      min1 = scalar < min1 ? scalar : min1;
      max1 = scalar > max1 ? scalar : max1;
    }

    //project each of obj2's points onto the perpendicular
    //save this max and min
    var min2 = Infinity;
    var max2 = 0;
    for( var x in obj2.points ){
      var scalar = obj2.points[x][0] * perpendicular[0] + obj2.points[x][1] * perpendicular[1];
      min2 = scalar < min2 ? scalar : min2;
      max2 = scalar > max2 ? scalar : max2;
    }
    //compare obj1's max and min to obj2's max and min
    if( max1 < min2 || max2 < min1 ){
      return false;
    }
    //if they overlap, continue
  }
  //if no gaps are found, then the two objects intersect
  return true;
};

module.exports = {"trueCollides": trueCollides};
