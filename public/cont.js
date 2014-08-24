var control = function(pjs) {

  var halfScreenWidth;

  var leftStick = {};
  var rightStick = {};

  leftStick.id;
  rightStick.id;

  leftStick.origin = new pjs.PVector();
  rightStick.origin = new pjs.PVector();

  leftStick.current = new pjs.PVector();
  rightStick.current = new pjs.PVector();

  leftStick.active = false;
  rightStick.active = false;

  var outerRadius;
  var innerRadius;
  var maxStickTravel;
  
  pjs.setup = function() {

    pjs.size(pjs.screenWidth,pjs.screenHeight);
    halfScreenWidth = pjs.screenWidth / 2;
    pjs.smooth();
    pjs.noStroke();
    pjs.frameRate(60);
    outerRadius = 120;
    //outerRadius = pjs.screenWidth / 4;
    innerRadius = outerRadius / 4 * 3;
    maxStickTravel = outerRadius / 4;

  };


  pjs.draw = function() {
    pjs.background(pjs.color(221,223,216));

    if (leftStick.active || rightStick.active) {
      if (leftStick.active === true) {
        pjs.fill(50,50,50);
        pjs.ellipse(leftStick.origin.x, leftStick.origin.y, outerRadius, outerRadius);
        pjs.fill(100, 100, 100);
        pjs.ellipse(leftStick.current.x, leftStick.current.y, innerRadius, innerRadius);
      }
      if (rightStick.active === true) {
        pjs.fill(50,50,50);
        pjs.ellipse(rightStick.origin.x, rightStick.origin.y, outerRadius, outerRadius);
        pjs.fill(100, 100, 100);
        pjs.ellipse(rightStick.current.x, rightStick.current.y, innerRadius, innerRadius);
      }
    }

    else {
      pjs.background(pjs.color(221,223,216));
      pjs.noLoop();
    }

  };

  pjs.touchStart = function(e) {

    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
      var tempTouch = e.changedTouches[i];
      if (leftStick.active === false && tempTouch.clientX < halfScreenWidth) {
        leftStick.origin.set(tempTouch.clientX, tempTouch.clientY, 0);
        leftStick.current.set(tempTouch.clientX, tempTouch.clientY, 0);
        leftStick.id = tempTouch.identifier;       
        leftStick.active = true;
        pjs.loop();
      }
      else if (rightStick.active === false) {
        rightStick.origin.set(tempTouch.clientX, tempTouch.clientY, 0);
        rightStick.current.set(tempTouch.clientX, tempTouch.clientY, 0);
        rightStick.id = tempTouch.identifier;       
        rightStick.active = true;
        pjs.loop();
      }
    }
  };

  pjs.touchEnd = function(e) {

   e.preventDefault();

    for (var i = 0; i < e.changedTouches.length; i++) {

      if (leftStick.id === e.changedTouches[i].identifier) {
        leftStick.active = false;
        socket.emit('left stick stop', {roomID: contComm.roomID});
      }
      else if (rightStick.id === e.changedTouches[i].identifier) {
        rightStick.active = false;
        socket.emit('right stick stop', {roomID: contComm.roomID});
      }

    }
  };

  pjs.touchMove = function(e) {

    e.preventDefault();

    for (var i = 0; i < e.changedTouches.length; i++) {

      var tempTouch = e.changedTouches[i];
      var tempVector = new pjs.PVector(tempTouch.clientX, tempTouch.clientY);

      if (leftStick.id === tempTouch.identifier) {
        var currVector = pjs.PVector.sub(tempVector, leftStick.origin);
        var currDist = currVector.mag();
        var activeDist = (currDist < maxStickTravel ? currDist : maxStickTravel);
        var currX, currY;

        if (currDist !== 0) {
          var currAngle = Math.atan(currVector.y/currVector.x);
          if (currVector.x < 0) {
            currAngle += Math.PI;
          }
          currX = Math.cos(currAngle) * (activeDist) + leftStick.origin.x;
          currY = Math.sin(currAngle) * (activeDist) + leftStick.origin.y;
        }
        else {
          currX = leftStick.origin.x;
          currY = leftStick.origin.y;
        }
        leftStick.current.set(currX, currY, 0);

        var distPercent = activeDist / maxStickTravel;

        currVector.normalize();

        socket.emit('left stick move', {roomID: contComm.roomID, 'currVector': currVector, 'distPercent': distPercent});

      } else if (rightStick.id === tempTouch.identifier) {
        var currVector = pjs.PVector.sub(tempVector, rightStick.origin);
        var currDist = currVector.mag();
        var activeDist = (currDist < maxStickTravel ? currDist : maxStickTravel);
        var currX, currY;
        
        if (currDist !== 0) {
          var currAngle = Math.atan(currVector.y/currVector.x);
          if (currVector.x < 0) {
            currAngle += Math.PI;
          }
          currX = Math.cos(currAngle) * (activeDist) + rightStick.origin.x;
          currY = Math.sin(currAngle) * (activeDist) + rightStick.origin.y;
        }
        else {
          currX = rightStick.origin.x;
          currY = rightStick.origin.y;
        }
        rightStick.current.set(currX, currY, 0);

        socket.emit('right stick move', {roomID: contComm.roomID, vel: currVector});

      }
    }
  };

};

module.exports = control;