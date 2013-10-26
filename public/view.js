// red 221, 105, 97       dd6961
// green     161, 200, 154     a1c89a


//note think about square snake and how it targets


var view = function(pjs) {


// the following are variables used throughout the game
/*******************************************************************************************************/

  var bkg = pjs.color(221,223,216);
    //221,223,216    grey
    //236,229,206    cake
  var player;
  var powerManager;
  var translated;
  var bgSquares = [];

  // the following is the velocity vector for all projectiles and it comes from the controller
  var projVel = new pjs.PVector();
  var rightStickActive = false;
  var leftStickActive = false;
  var powers = [];
  var powersToDel = [];
  var projectiles = []; 
  var projToDel = [];
  var enemies = [];
  var enemiesToDel = [];
  var deadPointArr = []; // the following will be used for displaying the points over dead enemies
  var deadPointToDel = [];

  var fSize;
  var f;

  var increment;

  var quarterMaxScreenDir;
  var quarterMaxScreenDirSquared;
  var maxScreenDir;
  var halfMaxScreenDir; // for burst
  var maxScreenDirSquare;
  var eighthWidth;
  var eighthHeight;
  //var twiceMaxScreenDir;
  //var numStdEnemies = 0;
  var rootTwo = Math.sqrt(2);


  var flags = [];
  var enemySetups;

  // TO ADD A POWER
  // 1.  create power object
  // 1.  create power color
  // 2.  change rng for powermanager
  // 3.  create proj object
  // 3.  change player.shoot
  // 4.  change displayInfo

  // these are for powers themeselves
  var powerRadius;
  var powerOuterWidth;
  //var powerInnerWidth;
  //var weaponColor = pjs.color(186,62,60);

  var playerColor = pjs.color(51,130,198); // bright light blue
  // all the weapon colors
  var burstColor = pjs.color(145,181,87); // // light green
  var oscColor = pjs.color(37,197,189);   // teal
  var rapidColor = pjs.color(143,141,184);   // light purple good
  var treeColor = pjs.color(243,175,66);    // yellow good
  var splashColor = pjs.color(133,161,144);   //  ight green 133,161,144
  var baitColor = pjs.color(244,148,148);     // pink    246 185 186
  var speedColor = pjs.color(249,183,125);    // tan
  var shieldColor = pjs.color(106,188,218);     // light blue

  var shieldWidth;

  // all the enemy colors 
  var enemyColors = [ 
  /* 
    pjs.color(41,89,111),// deep blue
    pjs.color(197,64,35), // //  red
    pjs.color(125,73,109), // dark purple
    pjs.color(94,117,92),  //dark green    same as powerup
    pjs.color(52,52,78),   // dark blue
    pjs.color(58,65,90),    // dark blue
    pjs.color(101,66,122),    // dark purple
    pjs.color(143,17,72),   // deep red
    pjs.color(39,61,77),
    pjs.color(94,12,41),    // dark red
    pjs.color(82,37,58),   // magentaish  
    pjs.color(62,68,56),    // dark green    iffy
    pjs.color(0,62,64),    // dark green
    
    pjs.color(94,12,41),
    pjs.color(82,37,58),        // only midnight
    pjs.color(71,61,74),
    pjs.color(59,86,91),
    pjs.color(51,102,102),

    pjs.color(52,52,78),    // these three blue
    pjs.color(58,65,90),
    pjs.color(86,105,129),

    pjs.color(80,67,117),  // these two purple
    pjs.color(57,50,77),

    pjs.color(89,40,49),     // these two red
    pjs.color(89,40,49),

    pjs.color(3,101,100)      // greeen    

    */

    pjs.color(73,45,73),  //night shift
    pjs.color(81,68,95),  //moon warrior  
    pjs.color(90,92,117),   // isabella
    pjs.color(30,72,86),   // tokio night
    pjs.color(19,38,81),   // tokio deep night
    //pjs.color(2,8,60),     // tokio in the abyss
    pjs.color(70,104,91), ///far,far away
    pjs.color(100,138,100), // wicked witchcraft
    pjs.color(77,143,131),  // bubble
    pjs.color(185,82,78),   //dont kow name
    pjs.color(212,103,0),  // pumpkin pie
    pjs.color(158,63,0)    // bon voyage

  ]


  //var enemyColors = [pjs.color(0), pjs.color(255)];



  var alternateTarget = null;

  // the following are for generating enemies
  var lastSpawn;
  var numToSpawn = 1;

  var increaseNum = 0;
  var addType = 0;
  var typesAvail = 1;

  var enemySetups;
  var mouseDown = 0;





  var halfScreenWidth;

  var leftStick = {};
  var rightStick = {};

  leftStick.origin = new pjs.PVector();
  rightStick.origin = new pjs.PVector();

  leftStick.current = new pjs.PVector();
  rightStick.current = new pjs.PVector();

  var outerRadius;
  var innerRadius;
  var maxStickTravel;

  var extraEnemyHealth = 0;


/*******************************************************************************************************/
/*
  pjs.resizeSketch = function() {
    pjs.size($(window).width(), $(window).height());
  };






/*******************************************************************************************************/

  pjs.setup = function() {
    pjs.size(pjs.screenWidth,pjs.screenHeight);
    pjs.smooth();
    pjs.noStroke();
    pjs.frameRate(60);

    //borders = new Borders();

    maxScreenDir = Math.ceil(Math.max(pjs.screenWidth, pjs.screenHeight));
    maxScreenDir = Math.max(maxScreenDir, 900);
    fSize = maxScreenDir / 32;
    if (touchable) {
      fSize = Math.max(fSize, 48);
    }

    increment = (2 * maxScreenDir) / 6;

    f = pjs.createFont("Arial", fSize);
    halfMaxScreenDir = .5 * maxScreenDir;
    maxScreenDirSquare = maxScreenDir * maxScreenDir;
    halfMaxScreenDirSquared = halfMaxScreenDir * halfMaxScreenDir;
    quarterMaxScreenDir = maxScreenDir / 4;
    quarterMaxScreenDirSquared = quarterMaxScreenDir * quarterMaxScreenDir;
    eighthWidth= pjs.screenWidth / 8;
    eighthHeight = pjs.screenHeight / 8;
    halfScreenWidth = pjs.screenWidth / 2;

    player = new Player(pjs.screenWidth/2,pjs.screenHeight/2);
    translated = new pjs.PVector(0,0);
    powerManager = new PowerManager();
    powerRadius = player.radius * 2 / 3;
    powerOuterWidth = powerRadius * 2;
    //powerInnerWidth = powerOuterWidth * 2 / 3;

    shieldWidth = maxScreenDir / 72;

   // fix triangles and take squares off as first enemy
    enemySetups = [
      largeTriangleSetup,
      squareSnakeSetup,
      dividedSquareSetup,
      divisibleSquareSetup,
      sprinterSetup,
      guardianSetup
    ];

    outerRadius = 120;
    //outerRadius = pjs.screenWidth / 4;
    innerRadius = outerRadius / 4 * 3;
    maxStickTravel = outerRadius / 4;

    setupBG();

    lastSpawn = pjs.millis();
  };

/*******************************************************************************************************/







// the following are the listeners for controller input 
/*******************************************************************************************************/

  socket.on('left stick move', function(data) {
    var speedPercent = data.distPercent * player.moveSpeed;
    player.vel.set(data.currVector);
    player.vel.mult(speedPercent);
    leftStickActive = true;
  });

  socket.on('left stick stop', function() {
    player.vel.set(0, 0);
    leftStickActive = false;
  });

  socket.on('right stick move', function(data) {
    if (data.vel.x !== 0 || data.vel.y !== 0) {
      projVel.set(data.vel);
      projVel.normalize();
      rightStickActive = true;
    }
  });

  socket.on('right stick stop', function() {
    rightStickActive = false;
  });

/*******************************************************************************************************/


var gameOver = function() {
  pjs.noLoop();
  if (playComm.controlled) {
    playComm.tellContGameOver(player.score);
  }
  else {
    playComm.submitScore(player.score);
  }
};



// the following is the border class that is only used up above in set up really
/*******************************************************************************************************

  var Borders = function() {
    this.borderWidth = 60;
    this.topCorner = new pjs.PVector(-quarterMaxScreenDir, -quarterMaxScreenDir - this.borderWidth);
    this.leftCorner = new pjs.PVector(-quarterMaxScreenDir - this.borderWidth + 1, -quarterMaxScreenDir - this.borderWidth);
    this.rightCorner = new pjs.PVector(maxScreenDir + quarterMaxScreenDir - 1, -quarterMaxScreenDir - this.borderWidth);
    this.bottomCorner = new pjs.PVector(-quarterMaxScreenDir, maxScreenDir + quarterMaxScreenDir);

    this.illustrate = function() {
      pjs.rect(this.topCorner.x, this.topCorner.y, 1.5 * maxScreenDir, this.borderWidth);
      pjs.rect(this.bottomCorner.x, this.bottomCorner.y, 1.5 * maxScreenDir, this.borderWidth);
      pjs.rect(this.leftCorner.x, this.leftCorner.y, this.borderWidth, 1.5 * maxScreenDir + 2 * this.borderWidth);
      pjs.rect(this.rightCorner.x, this.rightCorner.y, this.borderWidth, 1.5 * maxScreenDir + 2 * this.borderWidth);
    };
  };


/*******************************************************************************************************/

  var setupBG = function() {
    var i = 0;
    var j = 0;
    for (var x = -halfMaxScreenDir; x < maxScreenDir + halfMaxScreenDir; x += increment) {
      for (var y = -halfMaxScreenDir; y < maxScreenDir + halfMaxScreenDir; y += increment) {
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
          bgSquares.push(new BGSquare(x,y));
        }
        i++;
      }
      j++;
      i = 0;
    }
  };

  function BGSquare(x,y) {
    this.x = x;
    this.y = y;
  }
  BGSquare.prototype.illustrate = function() {
    pjs.fill(pjs.color(190));
    pjs.rect(this.x,this.y, increment, increment)
  }

  var illustrateAnalogs = function() {
    var alphaValue = 122;
    if (leftStickActive === true) {
        pjs.fill(50,50,50, alphaValue);
        pjs.ellipse(leftStick.origin.x - translated.x, leftStick.origin.y - translated.y, outerRadius, outerRadius);
        pjs.fill(100, 100, 100, alphaValue);
        pjs.ellipse(leftStick.current.x - translated.x, leftStick.current.y - translated.y, innerRadius, innerRadius);
      }
    if (rightStickActive === true) {
      pjs.fill(50,50,50, alphaValue);
      pjs.ellipse(rightStick.origin.x - translated.x, rightStick.origin.y - translated.y, outerRadius, outerRadius);
      pjs.fill(100, 100, 100, alphaValue);
      pjs.ellipse(rightStick.current.x - translated.x, rightStick.current.y - translated.y, innerRadius, innerRadius);
    }
  };

  pjs.touchStart = function(e) {
    if (!playComm.controlled) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var tempTouch = e.changedTouches[i];
        console.log(tempTouch.identifier);
        if (leftStickActive === false && tempTouch.clientX < halfScreenWidth) {
          leftStick.origin.set(tempTouch.clientX, tempTouch.clientY, 0);
          leftStick.current.set(tempTouch.clientX, tempTouch.clientY, 0);
          leftStick.id = tempTouch.identifier;       
          leftStickActive = true;
          pjs.loop();
        }
        else if (rightStickActive === false) {
          rightStick.origin.set(tempTouch.clientX, tempTouch.clientY, 0);
          rightStick.current.set(tempTouch.clientX, tempTouch.clientY, 0);
          rightStick.id = tempTouch.identifier;       
          rightStickActive = true;
          pjs.loop();
        }
      }
    }
  };

  pjs.touchEnd = function(e) {
    if (!playComm.controlled) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (leftStick.id === e.changedTouches[i].identifier) {
          leftStickActive = false;
          player.vel.set(0,0);
        }
        else if (rightStick.id === e.changedTouches[i].identifier) {
          rightStickActive = false;
        }
      }
    }
  };

  pjs.touchMove = function(e) {

    if (!playComm.controlled) {
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
          var speedPercent = distPercent * player.moveSpeed;
          currVector.normalize();
          currVector.mult(speedPercent);
          player.vel.set(currVector);
        }
        else if (rightStick.id === tempTouch.identifier) {
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
          projVel.set(currVector);
          projVel.normalize();
        }
      }
    }
  };




// the following is the draw function that loops
/*******************************************************************************************************/
    pjs.draw = function() {

      pjs.background(bkg);
      //pjs.fill(bkg, 50);

      //pjs.fill(pjs.random(255),pjs.random(255),pjs.random(255));
      //pjs.rect(0,0,pjs.width, pjs.height);

      player.adjustTranslation();
      pjs.pushMatrix();
      pjs.translate(translated.x,translated.y);
      for (var i = 0; i < bgSquares.length; i++) {
        bgSquares[i].illustrate();
      }


      /* the following relies on the powerup manager to create and then 
      put powerups into the power array at the appropriate intervals */
      if (powerManager.canRun) {
        powerManager.initiatePower();
      }
      if ((pjs.millis() - powerManager.startTime) > powerManager.delayTime) {
        powerManager.generatePower();
      }

      /* the following handles illustrating the powers themselves and it
      handles removing them when they are either touched or out of duration */
      for (var i = 0; i < powers.length; i++) {
        if ((pjs.millis() - powers[i].startTime) > powerManager.powerDuration) {
          powersToDel.push(powers[i]);
        }
        else {
          powers[i].illustrate();
          checkIfPowerTouched(powers[i]);
        }
      }
      for (var i = 0; i < powersToDel.length; i++) {
        powers.splice(powers.indexOf(powersToDel[i]), 1);
      }
      powersToDel = [];

      generateEnemies();

      // the following handles illustrating all the enemies and determining
      // if any has been hit by a projectile
      for (var i = 0; i < enemies.length; i++) {
        enemies[i].illustrate();
        enemies[i].checkIfShot();
        enemies[i].checkIfHitPlayer();
      }
      for (var i = 0; i < enemiesToDel.length; i++) {
        enemies.splice(enemies.indexOf(enemiesToDel[i]), 1);
      }
      enemiesToDel = []; 

      /* the following handles illustrating all the projectiles that are
      currently on the map and it handles cleaning them up in case they
      are too far out of the screen */
      for (var i = 0; i < projectiles.length; i++) {
        projectiles[i].illustrate();
        checkProjDist(projectiles[i]);
      }
      for (var i = 0; i < projToDel.length; i++) {
        projectiles.splice(projectiles.indexOf(projToDel[i]), 1);
      }
      projToDel = [];


      /* the following handles illustrating the points that rise from dead enemies */
      for (var i = 0; i < deadPointArr.length; i++) {
        deadPointArr[i].illustrate();
      }
      for (var i = 0; i < deadPointToDel.length; i++) {
        deadPointArr.splice(deadPointArr.indexOf(deadPointToDel[i]), 1);
      }
      deadPointToDel = [];

      player.illustrate();

      displayInfo();

      /* the following handles the shooting function and cooldown rate */
      if ((pjs.millis() - player.lastFired) > player.currFireRate) {
        player.canShoot = true;
      } 
      document.body.onmousedown = function() {
        mouseDown++;
      };
      document.body.onmouseup = function() {
        mouseDown--;
      };
      if (player.canShoot) {
        if (rightStickActive || mouseDown === 1) {
          player.shoot();
        }
      }

      if (touchable && !playComm.controlled) {
        console.log('here');
        illustrateAnalogs();
      }
      // borders.illustrate();
      pjs.popMatrix();
    };
/*******************************************************************************************************/

/*******************************************************************************************************/
  pjs.keyPressed = function() {
    if (!leftStickActive) {
      if (!player.dying) {  
        var key = pjs.key.toString();
        if (key === 'w') {
          if (player.vel.x > 0) {
            player.vel.x = player.modifiedSpeed;
            player.vel.y = -player.modifiedSpeed;
          }
          else if (player.vel.x < 0) {
            player.vel.x = -player.modifiedSpeed;
            player.vel.y = -player.modifiedSpeed;
            }
          else {
            player.vel.y = -player.moveSpeed;
          }
        }
        else if (key === 's') {
          if (player.vel.x > 0) {
            player.vel.x = player.modifiedSpeed;
            player.vel.y = player.modifiedSpeed;
          }
          else if (player.vel.x < 0) {
            player.vel.x = -player.modifiedSpeed;
            player.vel.y = player.modifiedSpeed;
          }
          else {
            player.vel.y = player.moveSpeed;
          }
        }
        else if (key === 'a') {
          if (player.vel.y > 0) {
            player.vel.x = -player.modifiedSpeed;
            player.vel.y = player.modifiedSpeed;
          }
          else if (player.vel.y < 0) {
            player.vel.x = -player.modifiedSpeed;
            player.vel.y = -player.modifiedSpeed;
          }
          else {
            player.vel.x = -player.moveSpeed;
          }
        }
        else if (key === 'd') {
          if (player.vel.y > 0) {
            player.vel.x = player.modifiedSpeed;
            player.vel.y = player.modifiedSpeed;
          }
          else if (player.vel.y < 0) {
            player.vel.x = player.modifiedSpeed;
            player.vel.y = -player.modifiedSpeed;
          }
          else {
            player.vel.x = player.moveSpeed;
          }
        }
      }
    }
  };

  pjs.keyReleased = function() {
    if (!leftStickActive) {
      if (pjs.keyCode === 87) {
        if (player.vel.y === -player.moveSpeed) {
          player.vel.add(0, player.moveSpeed);
        }
        else if (player.vel.y === -player.modifiedSpeed) {
          player.vel.add(0, player.modifiedSpeed);
          if (player.vel.x > 0) {
            player.vel.x = player.moveSpeed;
          }
          else {
            player.vel.x = -player.moveSpeed;
          }
        }
      }
      else if (pjs.keyCode === 83) {
        if (player.vel.y === player.moveSpeed) {
          player.vel.add(0, -player.moveSpeed);
        }
        else if (player.vel.y === player.modifiedSpeed) {
          player.vel.add(0, -player.modifiedSpeed);
          if (player.vel.x > 0) {
            player.vel.x = player.moveSpeed;
          }
          else {
            player.vel.x = -player.moveSpeed;
          }
        }
      } 
      else if (pjs.keyCode === 65) {
        if (player.vel.x === -player.moveSpeed) {
          player.vel.add(player.moveSpeed, 0);
        }
        else if (player.vel.x === -player.modifiedSpeed) {
          player.vel.add(player.modifiedSpeed, 0);
          if (player.vel.y > 0) {
            player.vel.y = player.moveSpeed;
          }
          else {
            player.vel.y = -player.moveSpeed;
          }
        }
      }
      else if (pjs.keyCode === 68) {
        if (player.vel.x === player.moveSpeed) {
          player.vel.add(-player.moveSpeed, 0);
        }
        else if (player.vel.x === player.modifiedSpeed) {
          player.vel.add(-player.modifiedSpeed, 0);
          if (player.vel.y > 0) {
            player.vel.y = player.moveSpeed;
          }
          else {
            player.vel.y = -player.moveSpeed;
          }
        }
      }
    }
  };
/*******************************************************************************************************/


// the following generates the enemies
/*******************************************************************************************************/

  function generateEnemies() {
    if (pjs.millis() - lastSpawn > 5000) {
      if (enemies.length < 16) {
        for (var i = 0; i < numToSpawn; i++) {
          if (i % 3 === 0) {
            largeTriangleSetup();
          }
          else {
            randomEnemy();
          }
        }
      }
      increaseNum++;
      if (increaseNum === 3) {
        if (enemies.length < 16) {
          numToSpawn++;
        }
        else {
          console.log('enemy health should increase');
          if (addHealth < 3) {
            increaseEnemyHealth();
          }
        }
        increaseNum = 0;
      }
      addType++;
      if (typesAvail < 6 && addType === 3) {
        typesAvail++;
        addType = 0;
      }
      lastSpawn = pjs.millis();
    }
  }

  function randomEnemy() {
    var temp = Math.floor(pjs.random(typesAvail));
    if (temp < typesAvail) {
      enemySetups[temp]();
    }
  }

  function increaseEnemyHealth() {
    extraEnemyHealth++;
    /*
    LargeTriangle.prototype.health++;
    SquareSnake.prototype.health++;
    DividedSquare.prototype.health++;
    LargeDivisibleSquare.prototype.health++;
    Sprinter.prototype.health++;
    Guardian.prototype.health++; */
  }

  function resetEnemyHealth() {
    extraEnemyHealth = 0; /*
    LargeTriangle.prototype.health = 0;
    SquareSnake.prototype.health = 0;
    DividedSquare.prototype.health = 0;
    LargeDivisibleSquare.prototype.health = 4;
    Sprinter.prototype.health = 4;
    Guardian.prototype.health = 0; */
  }





/*******************************************************************************************************/






/* the following displays game text */
/*******************************************************************************************************/

  /* the following displays game text */
  function displayInfo() {
    pjs.fill(pjs.color(60));
    pjs.textFont(f)
    pjs.textAlign(pjs.LEFT);
    //pjs.text("LIVES " + player.lives, fSize / 4 - translated.x,  fSize - translated.y);
    //pjs.text('lives x ' + player.lives, fSize / 4 - translated.x, fSize - translated.y);
    pjs.fill(playerColor);
    pjs.ellipse(fSize / 4 - translated.x + fSize / 2, fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
    pjs.fill(pjs.color(60));
    pjs.text('x' + player.lives, fSize / 4 - translated.x + fSize, fSize - translated.y);
    var temp;
    switch (player.currGun) {
    case (-1):
      break;

    //burst
    case (0):
      pjs.fill(burstColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;

    //oscillating
    case (1):
      pjs.fill(oscColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;

    // rapid fire
    case (2):
      pjs.fill(rapidColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;

    case (3):
      pjs.fill(treeColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;

    case (4):
      pjs.fill(splashColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;

    case (5):
      pjs.fill(baitColor);
      pjs.ellipse(fSize / 4 - translated.x + fSize / 2, 2 * fSize - translated.y - 3 * fSize / 8, fSize * 7 / 8, fSize * 7 / 8);
      pjs.fill(pjs.color(60));
      pjs.text('x' + player.currAmmo, fSize / 4 - translated.x + fSize, 2 * fSize - translated.y);
      break;
    }

    pjs.textAlign(pjs.RIGHT);
    //pjs.text("score", pjs.width - fSize / 4 - translated.x, fSize - translated.y);
    pjs.text(player.score, pjs.width - fSize / 4 - translated.x, fSize - translated.y);
  }

  function DeadPoint(x, y, score) {
    this.startY = y;
    this.currY = y;
    this.currX = x;
    this.score = score;
  };

  DeadPoint.prototype.illustrate = function() {
    this.currY = this.currY - 1;
    pjs.fill(pjs.color(60));
    pjs.textFont(f);
    pjs.text(this.score, this.currX, this.currY);
    if (this.startY - this.currY > 15) {
      deadPointToDel.push(this);
    }
  };

/*******************************************************************************************************/
















    /* the following is the player with shooting and adjusting translation methods */
    function Player(x, y) {
      this.pos = new pjs.PVector(x, y);
      this.vel = new pjs.PVector();

      this.radius = maxScreenDir / 24;  // /18
      this.currWidth = 0;
      this.maxWidth = this.radius * 2;
      this.speed = 3;  //this is for proporition to projectiles and enemies
      this.moveSpeed = 3;   // this is for actual player movement

      this.modifiedSpeed = rootTwo * this.moveSpeed / 2;

      this.canShoot = true;
      this.lastFired;
      this.currFireRate = 500; // changed
      this.currGun;
      this.currAmmo = 999;

      this.lives = 3;
      this.score = 0;

      this.spawning = true;
      this.dying = false;

      this.spedUp = false;
      this.spedTime;

      this.shielded = false;
      this.shieldedTime;
    };

      Player.prototype.illustrate = function() {
        if (this.spawning) {
          this.currWidth++;
          if (this.currWidth >= this.maxWidth) {
            this.spawning = false;
            this.currGun = -1;
          }
        } else if (this.dying) {
          this.vel.set(0,0);
          this.currWidth--;
          if (this.currWidth === 0) {
            if (this.lives > 1) {
              this.pos.set(pjs.screenWidth/2 - translated.x,pjs.screenHeight/2 - translated.y);
              this.lives--;
              this.spawning = true;
              this.dying = false;
              this.spedUp = false;
              this.moveSpeed = 3;
              this.modifiedSpeed = rootTwo * 3 / 2;
              this.currFireRate = 500;
              numToSpawn = 1;
              increaseNum = 0;
              this.shielded = true;
              this.shieldedTime = pjs.millis() - 5000;
              resetEnemyHealth();
            }
            else {
              gameOver();
            }
          }
        }
        if (this.pos.x < -quarterMaxScreenDir && this.vel.x <= 0) {
          if (this.pos.y < -quarterMaxScreenDir && this.vel.y <= 0) {
            this.vel.set(0, 0);
          }
          else if (this.pos.y >= maxScreenDir + quarterMaxScreenDir && this.vel.y >= 0) {
            this.vel.set(0, 0);
          }
          else {
            this.vel.set(0, this.vel.y);
          }
          this.pos.add(this.vel);
        }
        else if (this.pos.x >= maxScreenDir + quarterMaxScreenDir && this.vel.x >= 0) {
          if (this.pos.y <= -quarterMaxScreenDir && this.vel.y <= 0) {
            this.vel.set(0, 0);
          }
          else if (this.pos.y >= maxScreenDir + quarterMaxScreenDir && this.vel.y >= 0) {
            this.vel.set(0, 0);
          }
          else {
            this.vel.set(0, this.vel.y);
          }
          this.pos.add(this.vel);
        }
        else if (this.pos.y <= -quarterMaxScreenDir && this.vel.y <= 0) {
          this.vel.set(this.vel.x, 0);
          this.pos.add(this.vel);
        }
        else if (this.pos.y >= maxScreenDir + quarterMaxScreenDir && this.vel.y >= 0) {
          this.vel.set(this.vel.x, 0);
          this.pos.add(this.vel);
        }
        else {
          this.pos.add(this.vel);
        }
        if (this.shielded) {
          pjs.fill(shieldColor);
          pjs.ellipse(this.pos.x, this.pos.y, this.currWidth + shieldWidth, this.currWidth + shieldWidth);
          if (pjs.millis() - this.shieldedTime > 10000) {
            this.shielded = false;
            player.radius = maxScreenDir / 24;
          }
        }
        pjs.fill(playerColor);
        pjs.ellipse(this.pos.x, this.pos.y, this.currWidth, this.currWidth);

        //pjs.fill(pjs.random(255),pjs.random(255),pjs.random(255));

        if (this.spedUp) {
          if (pjs.millis() - this.spedTime > 10000) {
            //socket.emit('speed down', {roomID: comm.roomID});
            this.moveSpeed = 3;
            this.modifiedSpeed = rootTwo * 3 / 2;
            this.spedUp = false;
          }
        }
      };

     Player.prototype.shoot = function() {
        if (!this.spawning && !this.dying) {
          var proj;
          switch (this.currGun) {
          case (-1):
            defaultProjSetup(this.pos.x,this.pos.y);
            break;
          case (0):
            burstProjSetup(this.pos.x, this.pos.y);
            break;
          case (1):
            oscRadiusProjSetup(this.pos.x, this.pos.y);
            break;
          case (2):
            rapidProjSetup(this.pos.x, this.pos.y);
            break;
          case (3):
            treeProjSetup(this.pos.x, this.pos.y);
            break;
          case (4):
            splashProjSetup(this.pos.x, this.pos.y);
            break;
          case (5):
            baitProjSetup(this.pos.x,this.pos.y);
            break;
          default:
            console.log('what');
          }
          this.currAmmo--;
          this.canShoot = false;
          this.lastFired = pjs.millis();
          if (this.currAmmo <= 0) {
            this.currGun = -1;
            this.currAmmo = 999;
            this.currFireRate = 500;
          }
        }
      };

      Player.prototype.adjustTranslation = function() {
        var screenPos = new pjs.PVector(this.pos.x + translated.x,
          this.pos.y + translated.y);
        if (screenPos.x < pjs.width*1/4){
          translated.x = pjs.width*1/4 - this.pos.x;
        }
        else if (screenPos.x > pjs.width*3/4){
          translated.x = pjs.width*3/4 - this.pos.x;
        }
        if (screenPos.y < pjs.height*1/4){
          translated.y = pjs.height*1/4 - this.pos.y;
        }
        else if (screenPos.y > pjs.height*3/4){
          translated.y = pjs.height*3/4 - this.pos.y;
        }
      };












   /* the following is everything related to powerups */

    function PowerManager() {
      this.canRun = true;
      this.startTime;
      this.delayTime;
      this.power;
      this.powerDuration = 15000;    /* this number needs to be changed */
    };
    PowerManager.prototype.initiatePower = function() {
      this.startTime = pjs.millis();
      this.delayTime = pjs.random(2000, 8000);   /* these numbers need to be changed */
      this.power = Math.floor(pjs.random(9));
      this.canRun = false;
    };
    PowerManager.prototype.generatePower = function() {
      var pos = new pjs.PVector(pjs.random(0 - translated.x, pjs.width - translated.x),
      pjs.random(0 - translated.y, pjs.height - translated.y));
      if (!(pos.x < -quarterMaxScreenDir || pos.x > maxScreenDir + quarterMaxScreenDir || 
      pos.y < -quarterMaxScreenDir || pos.y > maxScreenDir + quarterMaxScreenDir)) {
      switch (this.power) {
        case 0:
          powers.push(new BurstPower(pos));
          break;
        case 1:
          powers.push(new OscRadiusPower(pos));
          break;
        case 2:
          powers.push(new RapidFirePower(pos));
          break;
        case 3:
          powers.push(new TreePower(pos));
          break;
        case 4:
          powers.push(new SplashPower(pos));
          break;
        case 5:
          powers.push(new BaitPower(pos));
          break;
        case 6:
          powers.push(new LifePower(pos));
          break;
        case 7:
          powers.push(new SpeedPower(pos));
          break;
        case 8:
          powers.push(new ShieldPower(pos));
          break;
        default:
          console.log('bye');   
        }
      }
      this.canRun = true;
    };

    function checkIfPowerTouched(power) {
      if (!player.spawning && !player.dying) {
        var radiusSquare = (power.radius + player.radius) * (power.radius + player.radius);
        var xDist = player.pos.x - power.pos.x;
        var yDist = player.pos.y - power.pos.y;
        var xySqr = xDist * xDist + yDist * yDist - radiusSquare;
        if (xySqr <= 0) {
          powersToDel.push(power);
          powerUpPlayer(power);
        }
      }
    };

    function powerUpPlayer(power) {
      if (power.type === 0) { 
        player.currFireRate = power.fireRate; 
        if (player.currGun != power.gunNumber) {
          player.currAmmo = power.ammo;
          player.currGun = power.gunNumber;
        }
        else {
          player.currAmmo += power.ammo;
        }
      }
      else if (power.type === 1) {
        player.lives++;
      }
      else if (power.type === 2) {
        player.moveSpeed = 4.5;
        //player.modifiedSpeed = rootTwo * 13.5 / 4;
                            // rootTwo * 4.5 / 2 * 3 / 2;
                            //rootTwo
        player.modifiedSpeed = rootTwo * 4.5 / 2;
        player.spedUp = true;
        player.spedTime = pjs.millis();
      }
      else {
        player.shielded = true;
        player.radius = maxScreenDir / 18;
        player.shieldedTime = pjs.millis();
      }
    };

    function BurstPower(pos) {
      this.pos = pos;
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 600;
      this.gunNumber = 0;
      this.ammo = 24; 
      this.startTime = pjs.millis();
      this.type = 0;
    };
    BurstPower.prototype.illustrate = function() {
      pjs.fill(burstColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function OscRadiusPower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 1000;
      this.gunNumber = 1;
      this.ammo = 16; 
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 0;
    };
    OscRadiusPower.prototype.illustrate = function() {
      pjs.fill(oscColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function RapidFirePower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 100;
      this.gunNumber = 2;
      this.ammo = 128; 
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 0;
    };
    RapidFirePower.prototype.illustrate = function() {
      pjs.fill(rapidColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function TreePower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 400;
      this.gunNumber = 3;
      this.ammo = 16; 
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 0;
    };
    TreePower.prototype.illustrate = function() {
      pjs.fill(treeColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    var SplashPower = function(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 500;
      this.gunNumber = 4;
      this.ammo = 18;
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 0;
    };
    SplashPower.prototype.illustrate = function() {
      pjs.fill(splashColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function BaitPower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.fireRate = 700;
      this.gunNumber = 5;
      this.ammo = 1;
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 0;
    };
    BaitPower.prototype.illustrate = function() {
      pjs.fill(baitColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function LifePower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 1;
    };
    LifePower.prototype.illustrate = function() {
      pjs.fill(playerColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function SpeedPower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 2;
    };
    SpeedPower.prototype.illustrate = function() {
      pjs.fill(speedColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };

    function ShieldPower(pos) {
      this.radius = powerRadius;
      this.outerWidth = powerOuterWidth;
      this.pos = pos;
      this.startTime = pjs.millis();
      this.type = 3;
    };
    ShieldPower.prototype.illustrate = function() {
      pjs.fill(shieldColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.outerWidth, this.outerWidth);
    };
















    /* the following are all the projectile types and related functions */

    function checkProjDist(proj) {
      if (proj.pos.x < -translated.x - 2 * proj.radius ||
        proj.pos.x > pjs.screenWidth - translated.x + 2 * proj.radius ||
        proj.pos.y < -translated.y - 2 * proj.radius ||
        proj.pos.y > pjs.screenHeight - translated.y + 2 * proj.radius) {
        projToDel.push(proj);
      }
      else {
        var xDist = player.pos.x - proj.pos.x;
        var yDist = player.pos.y - proj.pos.y;
        var xySqr = xDist * xDist + yDist * yDist - proj.maxDistSqr;
        if (xySqr > 0) {
          projToDel.push(proj);
        }
      }
    }; 

    function defaultProjSetup(x, y) {
      projectiles.push(new DefaultProj(x, y));
    };

    function DefaultProj(x, y) {
      this.pos = new pjs.PVector(x, y);

      this.radius = player.radius / 5;
      this.width = this.radius * 2;
      this.speed = player.speed * 3;

      if (rightStickActive) {
        this.vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        this.vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        this.vel.sub(this.pos);
        this.vel.normalize(); 
      }
      this.vel.mult(this.speed);

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = false;

      this.damage = 1;

    };

    DefaultProj.prototype.hitEnemy = function() {
      this.collided = true;
      projToDel.push(this);
    };

    DefaultProj.prototype.illustrate = function() {
      pjs.fill(playerColor);
      this.pos.add(this.vel);
      pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };

   

    function burstProjSetup(x, y) {
      var pos = new pjs.PVector(x,y);
      var startPosLeftOne = new pjs.PVector(x,y);
      var startPosLeftTwo = new pjs.PVector(x,y);
      var startPosRightOne = new pjs.PVector(x,y);
      var startPosRightTwo = new pjs.PVector(x,y);

      var speed = player.speed * 4;

      var velZero;
      if (rightStickActive) {
        velZero = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        velZero = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        velZero.sub(pos);
        velZero.normalize(); 
      }
      velZero.mult(speed);

      var velZeroAngle = Math.atan(velZero.y/velZero.x);
      if (velZero.x < 0) {
        var velLeftOneAngle = velZeroAngle + Math.PI/24 + Math.PI; 
        var velLeftTwoAngle = velZeroAngle + Math.PI/12 + Math.PI;
        var velRightOneAngle = velZeroAngle - Math.PI/24 + Math.PI;
        var velRightTwoAngle = velZeroAngle - Math.PI/12 + Math.PI;
      }
      else {
        var velLeftOneAngle = velZeroAngle + Math.PI/24;
        var velLeftTwoAngle = velZeroAngle + Math.PI/12;
        var velRightOneAngle = velZeroAngle - Math.PI/24;
        var velRightTwoAngle = velZeroAngle - Math.PI/12;
      }

      var velLeftOne = new pjs.PVector(Math.cos(velLeftOneAngle), Math.sin(velLeftOneAngle));
      var velLeftTwo = new pjs.PVector(Math.cos(velLeftTwoAngle), Math.sin(velLeftTwoAngle));
      var velRightOne = new pjs.PVector(Math.cos(velRightOneAngle), Math.sin(velRightOneAngle));
      var velRightTwo = new pjs.PVector(Math.cos(velRightTwoAngle), Math.sin(velRightTwoAngle));

      velLeftOne.normalize();
      velLeftTwo.normalize();
      velRightOne.normalize();
      velRightTwo.normalize();

      velLeftOne.mult(speed);
      velLeftTwo.mult(speed);
      velRightOne.mult(speed);
      velRightTwo.mult(speed);

      projectiles.push(new BurstProj(pos, velZero));
      projectiles.push(new BurstProj(startPosLeftOne, velLeftOne));
      projectiles.push(new BurstProj(startPosLeftTwo, velLeftTwo));
      projectiles.push(new BurstProj(startPosRightOne, velRightOne));
      projectiles.push(new BurstProj(startPosRightTwo, velRightTwo));
    };

    function BurstProj(pos, vel) {
      this.pos = pos;
      this.vel = vel;
      this.radius = player.radius / 10;
      this.width = this.radius * 2;
      this.maxDistSqr = halfMaxScreenDirSquared;
      this.collided = false;
      this.damage = 1;
    };

    BurstProj.prototype.hitEnemy = function() {
      this.collided = true;
      projToDel.push(this);
    };

    BurstProj.prototype.illustrate = function() {
      this.pos.add(this.vel);
      pjs.fill(burstColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };



    var oscRadiusProjSetup = function(x, y) {
      projectiles.push(new OscRadiusProj(x, y));      
    };

    var OscRadiusProj = function(x, y) {
      this.pos = new pjs.PVector(x, y);

      this.radius = player.radius / 10;
      this.width = this.radius * 2;

      this.minWidth = this.width;
      this.maxWidth = player.maxWidth * 1.5;
      this.speed = player.speed * 3;

      if (rightStickActive) {
        this.vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        this.vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        this.vel.sub(this.pos);
        this.vel.normalize(); 
      }
      this.vel.mult(this.speed);

      this.growing = true;

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = false;

      this.damage = 1;

    };

    OscRadiusProj.prototype.hitEnemy = function() {
    };

    OscRadiusProj.prototype.illustrate = function() {
      this.pos.add(this.vel);
      if (this.growing) {
        this.width += 2;
      }
      else {
        this.width -= 2;
      }
      if (this.width > this.maxWidth) {
        this.growing = false;
      }
      else if (this.width < this.minWidth) {
        this.growing = true;
      }
      pjs.fill(oscColor);
      pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };

    var rapidProjSetup = function(x, y) {
      projectiles.push(new RapidProj(x,y));
    };

    var RapidProj = function(x, y) {
      this.pos = new pjs.PVector(x, y);

      this.radius = player.radius / 10;
      this.width = this.radius * 2;
      this.speed = player.speed * 4;

      if (rightStickActive) {
        this.vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        this.vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        this.vel.sub(this.pos);
        this.vel.normalize(); 
      }
      this.vel.mult(this.speed);

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = false;

      this.damage = 1;

    };

    RapidProj.prototype.hitEnemy = function() {
      this.collided = true;
      projToDel.push(this);
    };

    RapidProj.prototype.illustrate = function() {
      pjs.fill(rapidColor);
      this.pos.add(this.vel);
      pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };

    function treeProjSetup(x,y) {
      var vel;
      var pos = new pjs.PVector(x, y);
      if (rightStickActive) {
        vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y); 
        vel.sub(pos)
      }
      vel.normalize();
      projectiles.push(new TreeProj(pos, vel, 0));
    };

    function TreeProj(pos, vel, generation) {
      this.pos = pos;

      this.radius = player.radius / 5;
      this.width = this.radius * 2;
      this.speed = player.speed * 2;

      this.vel = new pjs.PVector(vel.x, vel.y);
      this.vel.mult(this.speed);

      this.generation = generation;

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = false;

      this.damage = 1;
      this.spawnTime = pjs.millis();
    };

    TreeProj.prototype.hitEnemy = function() {
      this.collided = true;
      projToDel.push(this);
    };

    TreeProj.prototype.illustrate = function() {
      pjs.fill(treeColor);
      if (this.generation > 2 || pjs.millis() - this.spawnTime < 400) {
        this.pos.add(this.vel);
        pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
      }
      else {
        var currAngle = Math.atan(this.vel.y/this.vel.x);
        if (this.vel.x < 0) {
          var leftAngle = currAngle + Math.PI/6 + Math.PI;
          var rightAngle = currAngle - Math.PI/6 + Math.PI;
        }
        else {
          var leftAngle = currAngle + Math.PI/6;
          var rightAngle = currAngle - Math.PI/6;
        }
        var velLeft = new pjs.PVector(Math.cos(leftAngle), Math.sin(leftAngle));
        var velRight = new pjs.PVector(Math.cos(rightAngle), Math.sin(rightAngle));
        velLeft.normalize();
        velRight.normalize();
        projectiles.push(new TreeProj(new pjs.PVector(this.pos.x, this.pos.y), velLeft, this.generation + 1));
        projectiles.push(new TreeProj(new pjs.PVector(this.pos.x, this.pos.y), velRight, this.generation + 1));
        projToDel.push(this);
      }
    };

    function splashProjSetup(x,y) {
      projectiles.push(new SplashProj(x,y));
    };

    function SplashProj(x, y) {
      this.pos = new pjs.PVector(x, y);

      this.radius = player.radius / 4;
      this.width = this.radius * 2;
      this.maxWidth = this.width * 4;

      this.speed = player.speed * 2;

      if (rightStickActive) {
        this.vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        this.vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        this.vel.sub(this.pos);
        this.vel.normalize(); 
      }
      this.vel.mult(this.speed);

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = false;

      this.damage = 1;

      this.splashing = false;
      
    };

    SplashProj.prototype.hitEnemy = function() {
      this.splashing = true;
    };

    SplashProj.prototype.illustrate = function() {
      pjs.fill(splashColor);
      if (!this.splashing) {
        this.pos.add(this.vel);
      }
      else {
        if (this.width < this.maxWidth) {
          this.width += 2;
        }
        else {
          this.collided = true;
          projToDel.push(this);
        }
      }
        pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };

    function baitProjSetup(x, y) {
      projectiles.push(new BaitProj(x,y));
    }

    function BaitProj(x, y) {
      this.pos = new pjs.PVector(x, y);
      this.origin = new pjs.PVector(x, y);

      this.radius = player.radius / 5;
      this.width = this.radius * 2;
      this.maxWidth = player.radius * 5;
      this.speed = player.speed * 5;

      if (rightStickActive) {
        this.vel = new pjs.PVector(projVel.x, projVel.y);
      }
      else {
        this.vel = new pjs.PVector(pjs.mouseX - translated.x, pjs.mouseY - translated.y);
        this.vel.sub(this.pos);
        this.vel.normalize(); 
      }
      this.vel.mult(this.speed);

      this.maxDistSqr = maxScreenDirSquare;

      this.collided = true;
      this.damage = 1;
      this.canDamage = false;

      this.stillMoving = true;

      this.travelDist = quarterMaxScreenDirSquared;

      this.startedStalling;

      this.stallingFlag = true;

      this.setTarget = false;

    };

    BaitProj.prototype.hitEnemy = function() {
    };

    BaitProj.prototype.illustrate = function() {
      pjs.fill(baitColor);
      if (this.stillMoving) {
        var xDist = this.pos.x - this.origin.x;
        var yDist = this.pos.y - this.origin.y;
        var dist = this.travelDist - (xDist * xDist + yDist * yDist); 
        if (dist > 0) {
          this.pos.add(this.vel);
        }
        else {
          this.stillMoving = false;
          this.startedStalling = pjs.millis();
        }
      }
      else {
        if (this.stallingFlag) {
          if (pjs.millis() - this.startedStalling > 3000) {
            this.stallingFlag = false;
          }
          else if (!this.setTarget) {
            alternateTarget = this;
            this.setTarget = true;
          }
        }
        else {
          if (this.width < this.maxWidth) {
            this.width += 2;
            if (!this.canDamage) {
              this.canDamage = true;
              this.collided = false;
            }
          }
          else {
            this.collided = true;
            projToDel.push(this);
            alternateTarget = null
          }
        }
      }
      pjs.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    };
















    /* the following are the different enemy types, and their helper functions like Setup, position
    randomizer, and collision detection */

    function randomEnemyColor() {
      return enemyColors[Math.floor(pjs.random(enemyColors.length))];
    }
    function randomEnemyPos() {
      var top = -translated.y;
      var bottom = pjs.screenHeight - translated.y;
      var left = -translated.x;
      var right = pjs.screenWidth - translated.x;
      var verticalMid = (top + bottom) / 2;
      var horizontalMid = (left + right) / 2;

      var optionOne;
      var optionTwo;
      var optionThree;

      if (player.pos.y < verticalMid) {
        optionOne = new pjs.PVector(pjs.random(left, right), pjs.random(verticalMid, bottom));
        var threeY = pjs.random(verticalMid, bottom + eighthHeight);

        if (player.pos.x < horizontalMid) {
          optionTwo = new pjs.PVector(pjs.random(horizontalMid, right), pjs.random(top, verticalMid));
          if (threeY > bottom) {
            var threeX = pjs.random(left - eighthWidth, horizontalMid);
          }
          else {
            var threeX = pjs.random(left - eighthWidth, left);
          }
        }
        else {
          optionTwo = new pjs.PVector(pjs.random(left, horizontalMid), pjs.random(top, verticalMid));
          if (threeY > bottom) {
            var threeX = pjs.random(horizontalMid, right + eighthWidth);
          }
          else {
            var threeX = pjs.random(right, right + eighthWidth);
          }
        }

      }
      else {
        optionOne = new pjs.PVector(pjs.random(left, right), pjs.random(top, verticalMid));
        var threeY = pjs.random(top - eighthHeight, verticalMid);

        if (player.pos.x < horizontalMid) {
          optionTwo = new pjs.PVector(pjs.random(horizontalMid, right), pjs.random(verticalMid, bottom));
          if (threeY < top) {
            var threeX = pjs.random(left - eighthWidth, horizontalMid);
          }
          else {
            var threeX = pjs.random(left - eighthWidth, left);
          }
        }
        else {
          optionTwo = new pjs.PVector(pjs.random(left, horizontalMid), pjs.random(verticalMid, bottom));
          if (threeY < top) {
            var threeX = pjs.random(horizontalMid, right + eighthWidth);
          }
          else {
            var threeX = pjs.random(right, right + eighthWidth);
          }
        }
      }
      optionThree = new pjs.PVector(threeX, threeY);

      var decider = pjs.random(4);
      if (decider < 2) {
        return optionOne;
      }
      else if (decider < 3) {
        return optionTwo;
      }
      else {
        return optionThree;
      }
    };

    //player.radius can be used here because it stays constant 
    function collisionCheckPlayerTriangle(triangle) {
      var radiusSquare = player.radius * player.radius; 

      var c1x = player.pos.x - triangle.pos.x;
      var c1y = player.pos.y - triangle.pos.y;
      var c1sqr = c1x * c1x + c1y * c1y - radiusSquare;
      if (c1sqr <= 0) {
        if (!player.shielded) {
          player.dying = true; 
          if (alternateTarget !== null) {
            projToDel.push(alternateTarget);
            alternateTarget = null;
          }
          for (var i = 0; i < enemies.length; i++) {
            enemies[i].dying = true;
          }
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          player.score += triangle.points;
        }
      }

      var c2x = player.pos.x - triangle.posLeft.x;
      var c2y = player.pos.y - triangle.posLeft.y;
      var c2sqr = c2x * c2x + c2y * c2y - radiusSquare;
      if (c2sqr <= 0) {
        if (!player.shielded) {
          player.dying = true; 
          if (alternateTarget !== null) {
            projToDel.push(alternateTarget);
            alternateTarget = null;
          }
          for (var i = 0; i < enemies.length; i++) {
            enemies[i].dying = true;
          }
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          player.score += triangle.points;
        }
      }
      var c3x = player.pos.x - triangle.posRight.x;
      var c3y = player.pos.y - triangle.posRight.y;
      var c3sqr = c3x * c3x + c3y * c3y - radiusSquare;
      if (c3sqr <= 0) {
        if (!player.shielded) {
          player.dying = true; 
          if (alternateTarget !== null) {
            projToDel.push(alternateTarget);
            alternateTarget = null;
          }
          for (var i = 0; i < enemies.length; i++) {
            enemies[i].dying = true;
          }
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          player.score += triangle.points;
        }
      }

      /* the following tests intersection with the edges */
      var e1x = triangle.posLeft.x - triangle.pos.x
      var e1y = triangle.posLeft.y - triangle.pos.y
      var e2x = triangle.posRight.x - triangle.posLeft.x
      var e2y = triangle.posRight.y - triangle.posRight.y
      var e3x = triangle.pos.x - triangle.posRight.x
      var e3y = triangle.pos.y - triangle.posRight.y

      var k = c1x * e1x + c1y * e1y
      if (k > 0) {
        var len = e1x * e1x + e1y * e1y;
        if (k < len) {
          if (c1sqr * len <= k * k) {
            if (!player.shielded) {
              player.dying = true; 
              if (alternateTarget !== null) {
                projToDel.push(alternateTarget);
                alternateTarget = null;
              }
              for (var i = 0; i < enemies.length; i++) {
                enemies[i].dying = true;
              }
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              player.score += triangle.points;
            }
          }
        }
      }
      k = c2x * e2x + c2y * e2y;
      if (k > 0) {
        var len = e2x * e2x + e2y * e2y;
        if (k < len) {
          if (c2sqr * len <= k * k) {
            if (!player.shielded) {
              player.dying = true; 
              if (alternateTarget !== null) {
                projToDel.push(alternateTarget);
                alternateTarget = null;
              }
              for (var i = 0; i < enemies.length; i++) {
                enemies[i].dying = true;
              }
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              player.score += triangle.points;
            }
          }
        }
      }
      k = c3x * e3x + c3y * e3y;
      if (k > 0) {
        var len = e3x * e3x + e3y * e3y;
        if (k < len) {
          if (c3sqr * len <= k * k) {
            if (!player.shielded) {
              player.dying = true; 
              if (alternateTarget !== null) {
                projToDel.push(alternateTarget);
                alternateTarget = null;
              }
              for (var i = 0; i < enemies.length; i++) {
                enemies[i].dying = true;
              }
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              player.score += triangle.points;
            }
          }
        }
      }
      return 0;
    };

    function collisionCheckProjTriangle(proj, triangle) {

      var projRad = proj.width / 2;

      var radiusSquare = projRad * projRad;

      var c1x = proj.pos.x - triangle.pos.x;
      var c1y = proj.pos.y - triangle.pos.y;
      var c1sqr = c1x * c1x + c1y * c1y - radiusSquare;
      if (c1sqr <= 0) {
        if (triangle.health > 0) {
          triangle.health -= proj.damage;
          triangle.hitBack = true; triangle.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          proj.hitEnemy();
          player.score += triangle.points;
        }
        return 1;
      }
      var c2x = proj.pos.x - triangle.posLeft.x;
      var c2y = proj.pos.y - triangle.posLeft.y;
      var c2sqr = c2x * c2x + c2y * c2y - radiusSquare;
      if (c2sqr <= 0) {
        if (triangle.health > 0) {
          triangle.health -= proj.damage;
          triangle.hitBack = true; triangle.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          proj.hitEnemy();
          player.score += triangle.points;
        }
        return 1;
      }
      var c3x = proj.pos.x - triangle.posRight.x;
      var c3y = proj.pos.y - triangle.posRight.y;
      var c3sqr = c3x * c3x + c3y * c3y - radiusSquare;
      if (c3sqr <= 0) {
        if (triangle.health > 0) {
          triangle.health -= proj.damage;
          triangle.hitBack = true; triangle.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          triangle.dying = true;
          triangle.hit = true;
          proj.hitEnemy();
          player.score += triangle.points;
        }
        return 1;
      }

      /* the following tests intersection with the edges */
      var e1x = triangle.posLeft.x - triangle.pos.x
      var e1y = triangle.posLeft.y - triangle.pos.y
      var e2x = triangle.posRight.x - triangle.posLeft.x
      var e2y = triangle.posRight.y - triangle.posRight.y
      var e3x = triangle.pos.x - triangle.posRight.x
      var e3y = triangle.pos.y - triangle.posRight.y

      var k = c1x * e1x + c1y * e1y
      if (k > 0) {
        var len = e1x * e1x + e1y * e1y;
        if (k < len) {
          if (c1sqr * len <= k * k) {
            if (triangle.health > 0) {
              triangle.health -= proj.damage;
              triangle.hitBack = true; triangle.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              proj.hitEnemy();
              player.score += triangle.points;
            }
            return 1;
          }
        }
      }
      k = c2x * e2x + c2y * e2y;
      if (k > 0) {
        var len = e2x * e2x + e2y * e2y;
        if (k < len) {
          if (c2sqr * len <= k * k) {
            if (triangle.health > 0) {
              triangle.health -= proj.damage;
              triangle.hitBack = true; triangle.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              proj.hitEnemy();
              player.score += triangle.points;
            }
            return 1;
          }
        }
      }
      k = c3x * e3x + c3y * e3y;
      if (k > 0) {
        var len = e3x * e3x + e3y * e3y;
        if (k < len) {
          if (c3sqr * len <= k * k) {
            if (triangle.health > 0) {
              triangle.health -= proj.damage;
              triangle.hitBack = true; triangle.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              triangle.dying = true;
              triangle.hit = true;
              proj.hitEnemy();
              player.score += triangle.points;
            }
            return 1;
          }
        }
      }
      return 0;
    };

    function collisionCheckPlayerSquare(square) {
      if (!square.dying && !square.spawning) {
        var radiusSquare = player.radius * player.radius;
        var c1x = player.pos.x - square.pos.x;
        var c1y = player.pos.y - square.pos.y;
        var c1sqr = c1x * c1x + c1y * c1y - radiusSquare;
        if (c1sqr <= 0) {
          if (!player.shielded) {
            player.dying = true; 
            if (alternateTarget !== null) {
              projToDel.push(alternateTarget);
              alternateTarget = null;
            }
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].dying = true;
            }
          }
          else {
            square.dying = true;
            square.hit = true;
            player.score += square.points;
          }
          return;
        }

        var c2x = player.pos.x - (square.pos.x + square.width);
        var c2y = player.pos.y - square.pos.y;
        var c2sqr = c2x * c2x + c2y * c2y - radiusSquare;
        if (c2sqr <= 0) {
          if (!player.shielded) {
            player.dying = true; 
            if (alternateTarget !== null) {
              projToDel.push(alternateTarget);
              alternateTarget = null;
            }
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].dying = true;
            }
          }
          else {
            square.dying = true;
            square.hit = true;
            player.score += square.points;
          }
          return;
        }
        var c3x = player.pos.x - (square.pos.x + square.width);
        var c3y = player.pos.y - (square.pos.y + square.height);
        var c3sqr = c3x * c3x + c3y * c3y - radiusSquare;
        if (c3sqr <= 0) {
          if (!player.shielded) {
            player.dying = true; 
            if (alternateTarget !== null) {
              projToDel.push(alternateTarget);
              alternateTarget = null;
            }
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].dying = true;
            }
          }
          else {
            square.dying = true;
            square.hit = true;
            player.score += square.points;
          }
          return;
        }
        var c4x = player.pos.x - square.pos.x;
        var c4y = player.pos.y - (square.pos.y + square.height);
        var c4sqr = c4x * c4x + c4y * c4y - radiusSquare;
        if (c4sqr <= 0) {
          if (!player.shielded) {
            player.dying = true; 
            if (alternateTarget !== null) {
              projToDel.push(alternateTarget);
              alternateTarget = null;
            }
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].dying = true;
            }
          }
          else {
            square.dying = true;
            square.hit = true;
            player.score += square.points;
          }
          return;
        }

        var e1x = square.width;
        var e1y = 0;
        var e2x = 0;
        var e2y = square.height;
        var e3x = -square.width;
        var e3y = 0;
        var e4x = 0;
        var e4y = -square.height;
        var k = c1x * e1x + c1y * e1y
        if (k > 0) {
          var len = e1x * e1x + e1y * e1y;
          if (k < len) {
            if (c1sqr * len <= k * k) {
              if (!player.shielded) {
                player.dying = true; 
                if (alternateTarget !== null) {
                  projToDel.push(alternateTarget);
                  alternateTarget = null;
                }
                for (var i = 0; i < enemies.length; i++) {
                  enemies[i].dying = true;
                }
              }
              else {
                square.dying = true;
                square.hit = true;
                player.score += square.points;
              }
              return;
            }
          }
        }
        k = c2x * e2x + c2y * e2y;
        if (k > 0) {
          var len = e2x * e2x + e2y * e2y;
          if (k < len) {
            if (c2sqr * len <= k * k) {
              if (!player.shielded) {
                player.dying = true; 
                if (alternateTarget !== null) {
                  projToDel.push(alternateTarget);
                  alternateTarget = null;
                }
                for (var i = 0; i < enemies.length; i++) {
                  enemies[i].dying = true;
                }
              }
              else {
                square.dying = true;
                square.hit = true;
                player.score += square.points;
              }
              return;
            }
          }
        }
        k = c3x * e3x + c3y * e3y;
        if (k > 0) {
          var len = e3x * e3x + e3y * e3y;
          if (k < len) {
            if (c3sqr * len <= k * k) {
              if (!player.shielded) {
                player.dying = true; 
                if (alternateTarget !== null) {
                  projToDel.push(alternateTarget);
                  alternateTarget = null;
                }
                for (var i = 0; i < enemies.length; i++) {
                  enemies[i].dying = true;
                }
              }
              else {
                square.dying = true;
                square.hit = true;
                player.score += square.points;
              }
              return;
            }
          }
        }
        k = c4x * e4x + c4y * e4y;
        if (k > 0) {
          var len = e4x * e4x + e4y * e4y;
          if (k < len) {
            if (c4sqr * len <= k * k) {
              if (!player.shielded) {
                player.dying = true; 
                if (alternateTarget !== null) {
                  projToDel.push(alternateTarget);
                  alternateTarget = null;
                }
                for (var i = 0; i < enemies.length; i++) {
                  enemies[i].dying = true;
                }
              }
              else {
                square.dying = true;
                square.hit = true;
                player.score += square.points;
              }
              return;
            }
          }
        }
      }
    };

    function collisionCheckProjSquare(proj, square) {
      /* the following tests intersection with a vertex */
      var projRad = proj.width / 2;
      var radiusSquare = projRad * projRad;
      var c1x = proj.pos.x - square.pos.x;
      var c1y = proj.pos.y - square.pos.y;
      var c1sqr = c1x * c1x + c1y * c1y - radiusSquare;
      if (c1sqr <= 0) {
        if (square.health > 0) {
          square.health -= proj.damage;
          square.hitBack = true; square.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          square.dying = true;
          square.hit = true;
          proj.hitEnemy();
          player.score += square.points;
        }
        return 1;
      }
      
      var c2x = proj.pos.x - (square.pos.x + square.width);
      var c2y = proj.pos.y - square.pos.y;
      var c2sqr = c2x * c2x + c2y * c2y - radiusSquare;
      if (c2sqr <= 0) {
        if (square.health > 0) {
          square.health -= proj.damage;
          square.hitBack = true; square.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          square.dying = true;
          square.hit = true;
          proj.hitEnemy();
          player.score += square.points;
        }
        return 1;
      }

      var c3x = proj.pos.x - (square.pos.x + square.width);
      var c3y = proj.pos.y - (square.pos.y + square.height);
      var c3sqr = c3x * c3x + c3y * c3y - radiusSquare;
      if (c3sqr <= 0) {
        if (square.health > 0) {
          square.health -= proj.damage;
          square.hitBack = true; square.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          square.dying = true;
          square.hit = true;
          proj.hitEnemy();
          player.score += square.points;
        }
        return 1;
      }
      var c4x = proj.pos.x - square.pos.x;
      var c4y = proj.pos.y - (square.pos.y + square.height);
      var c4sqr = c4x * c4x + c4y * c4y - radiusSquare;
      if (c4sqr <= 0) {
        if (square.health > 0) {
          square.health -= proj.damage;
          square.hitBack = true; square.startHitBack = pjs.millis();
          proj.hitEnemy();
        }
        else {
          square.dying = true;
          square.hit = true;
          proj.hitEnemy();
          player.score += square.points;
        }
        return 1;
      }
      /* the following tests intersection with the edges */
      var e1x = square.width;
      var e1y = 0;
      var e2x = 0;
      var e2y = square.height;
      var e3x = -square.width;
      var e3y = 0;
      var e4x = 0;
      var e4y = -square.height;
      var k = c1x * e1x + c1y * e1y
      if (k > 0) {
        var len = e1x * e1x + e1y * e1y;
        if (k < len) {
          if (c1sqr * len <= k * k) {
            if (square.health > 0) {
              square.health -= proj.damage;
              square.hitBack = true; square.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              square.dying = true;
              square.hit = true;
              proj.hitEnemy();
              player.score += square.points;
            }
            return 1;
          }
        }
      }
      k = c2x * e2x + c2y * e2y;
      if (k > 0) {
        var len = e2x * e2x + e2y * e2y;
        if (k < len) {
          if (c2sqr * len <= k * k) {
            if (square.health > 0) {
              square.health -= proj.damage;
              square.hitBack = true; square.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              square.dying = true;
              square.hit = true;
              proj.hitEnemy();
              player.score += square.points;
            }
            return 1;
          }
        }
      }
      k = c3x * e3x + c3y * e3y;
      if (k > 0) {
        var len = e3x * e3x + e3y * e3y;
        if (k < len) {
          if (c3sqr * len <= k * k) {
            if (square.health > 0) {
              square.health -= proj.damage;
              square.hitBack = true; square.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              square.dying = true;
              square.hit = true;
              proj.hitEnemy();
              player.score += square.points;
            }
            return 1;
          }
        }
      }
      k = c4x * e4x + c4y * e4y;
      if (k > 0) {
        var len = e4x * e4x + e4y * e4y;
        if (k < len) {
          if (c4sqr * len <= k * k) {
            if (square.health > 0) {
              square.health -= proj.damage;
              square.hitBack = true; square.startHitBack = pjs.millis();
              proj.hitEnemy();
            }
            else {
              square.dying = true;
              square.hit = true;
              proj.hitEnemy();
              player.score += square.points;
            }
            return 1;
          }
        }
      }
      return 0;
    };








    function sprinterSetup() {
      enemies.push(new Sprinter(extraEnemyHealth));
      enemies.push(new Sprinter(extraEnemyHealth));
      enemies.push(new Sprinter(extraEnemyHealth));
      enemies.push(new Sprinter(extraEnemyHealth));
    };
    function Sprinter(addHealth) {
      this.pos = randomEnemyPos();
      this.posLeft;
      this.posRight;
      if (alternateTarget === null) {
        this.goalPos = new pjs.PVector(player.pos.x, player.pos.y);
      }
      else {
        this.goalPos = new pjs.PVector(alternateTarget.pos.x, alternateTarget.pos.y);
      }
      this.edgeLength = 0;
      this.maxLength = player.maxWidth / 2;
      this.speed = 2 * player.speed;
      this.vel;
      this.spawning = true;
      this.dying = false;
      this.hit = false;
      this.color = randomEnemyColor();
      this.health = addHealth;
      this.points = (this.health + 1) * 100;
      this.startTime;
      this.sprintFlag = false;
      //this.hitBack;   it needs health now but it still doesnt need hitbakc
      //this.startHitBack;
    };


   Sprinter.prototype.checkIfHitPlayer = function() {
     if (!this.spawning && !this.dying) {
       collisionCheckPlayerTriangle(this);
     }
   };
   Sprinter.prototype.checkIfShot = function() {
     if (!this.spawning && !this.dying) {
       for (var i = 0; i < projectiles.length; i++) {
         if (!projectiles[i].collided) {
           if (collisionCheckProjTriangle(projectiles[i], this) === 1 && this.dying) break;
         }
       }
     }
   };

   Sprinter.prototype.illustrate = function() {
      pjs.fill(this.color);
      /* these calculate where the origin of the triangle should be */
      if (!this.dying) {
        this.vel = pjs.PVector.sub(this.goalPos, this.pos);
        var dist = this.vel.mag();  
        if (dist > player.radius / 5) {
          this.vel.normalize();
          this.vel.mult(this.speed);
          if (!this.spawning) {
            if (!this.sprintFlag) {
              if (pjs.millis() - this.startTime > 1000) {
                this.sprintFlag = true;
              }
            }
            else {
              this.pos.add(this.vel);
            }
          }
          else {
            this.edgeLength += 2;
            if (this.edgeLength >= this.maxLength) {
              this.spawning = false;
              this.startTime = pjs.millis();
            }
          }
        }
        else {
          this.dying = true;
        }
      }
      else {
        this.edgeLength -= 2;
        if (this.edgeLength === 0) {
          enemiesToDel.push(this);
          if (this.hit) {
            deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points)); 
          }
        }
      }
 
      var angleZero = Math.atan(this.vel.y/this.vel.x);
      if (this.vel.x < 0) {
        var angleLeft = angleZero + 3 * Math.PI/4 + Math.PI; 
        var angleRight = angleZero - 3 * Math.PI/4 + Math.PI;
      }
      else {
        var angleLeft = angleZero + 3 * Math.PI/4; 
        var angleRight = angleZero - 3 * Math.PI/4;
      }

      var dirLeft = new pjs.PVector(Math.cos(angleLeft), Math.sin(angleLeft));
      var dirRight = new pjs.PVector(Math.cos(angleRight), Math.sin(angleRight)); 

      dirLeft.normalize();
      dirRight.normalize();

      dirLeft.mult(this.edgeLength);
      dirRight.mult(this.edgeLength);

      this.posLeft = new pjs.PVector.add(this.pos, dirLeft);
      this.posRight = new pjs.PVector.add(this.pos, dirRight);

      pjs.triangle(this.pos.x, this.pos.y,
      this.posLeft.x, this.posLeft.y,
      this.posRight.x, this.posRight.y);
   };

    function guardianSetup() {
      var pos = randomEnemyPos();
      var color = randomEnemyColor();
      var leaderColor = randomEnemyColor();
      if (color === leaderColor) {
        var temp = enemyColors.indexOf(leaderColor);
        if (temp > 0) {
          color = enemyColors[temp - 1];
        } else {
          color = enemyColors[1];
        }
      }
      var children = [];
      for (var i = 0; i < 4; i++) {
        var tempChild = new GuardianChild(pos, color, i, extraEnemyHealth);
        enemies.push(tempChild);
        children.push(tempChild);
      }

      var tempParent = new Guardian(pos, leaderColor, children, extraEnemyHealth);
      enemies.push(tempParent);
      for (var i = 0; i < 4; i++) {
        children[i].setParent(tempParent);
      }
    };

    function Guardian(pos, color, children, addHealth) {

      this.pos = pos;

      this.height = player.maxWidth;
      this.width = player.maxWidth;

      //this.speed = 0;
      //this.vel

      this.sizeModifier = new pjs.PVector(1,1);

      this.spawning = true;
      this.dying = false;
      this.hit = false;

      this.health = 2 + addHealth;
      this.points = (this.health + 1) * 100;

      this.color = color;

      this.red = pjs.red(this.color);
      this.green = pjs.green(this.color);
      this.blue = pjs.blue(this.color);
      this.alpha = 0;

      this.spawnTime;

      this.children = children;
      this.numChildren = 4;
      this.notifyFlag = false;
   
    };

       Guardian.prototype.checkIfHitPlayer = function() {
        if (!this.spawning && !this.dying) {
          collisionCheckPlayerSquare(this);
        }
      };

      Guardian.prototype.checkIfShot = function() {
        if (!this.dying && this.numChildren <= 0) {
          for (var i = 0; i < projectiles.length; i++) {
            if(!projectiles[i].collided) {
              if (collisionCheckProjSquare(projectiles[i], this) === 1 && this.dying) break;
            }
          }
        }
      };

      Guardian.prototype.illustrate = function() {
        pjs.fill(pjs.color(this.red, this.green, this.blue, this.alpha));
        if (!this.dying) {
          if (!this.spawning) {
            if (pjs.millis() - this.spawnTime > 5000) {
              if (!this.notifyFlag) {
                for (var i = 0; i < this.children.length; i++) {
                  this.children[i].notified = true;
                }
                this.notifyFlag = true;
              }
              this.alpha -= 2;
              if (this.alpha <= 0) {
                this.spawning = true;
                this.notifyFlag = false;
                this.pos = randomEnemyPos();
                for (var i = 0; i < this.children.length; i++) {
                  if (!this.children[i].dying) {
                    this.children[i].prepareSpawn(this.pos);
                  }
                }
              }
            }
          }
          else {
            if (this.alpha < 255) {
              this.alpha += 2;
            }
            else {
              this.spawnTime = pjs.millis();
              this.spawning = false;
            }
          }
        }
        else {
          this.pos.add(this.sizeModifier);
          this.width -= 2;
          this.height -= 2;
          if (this.width <= 0) {
            enemiesToDel.push(this);
            if (this.hit) {
              deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points));
            }
          }
        }
        pjs.rect(this.pos.x, this.pos.y, this.width,this.width);
      };

    function GuardianChild(pos, color, place, addHealth) {

      this.pos;

      this.height = player.maxWidth / 2;
      this.width = player.maxWidth / 2;

      this.sizeModifier = new pjs.PVector(1,1);

      //this.speed = 0;
      //this.vel;

      this.spawning = true;
      this.dying = false;
      this.hit = false;      

      this.color = color;

      this.red = pjs.red(this.color);
      this.green = pjs.green(this.color);
      this.blue = pjs.blue(this.color);
      this.alpha = 0;

      this.place = place;

      this.health = addHealth;
      this.points = (this.health + 1) * 100;

      this.notified; 

      this.prepareSpawn(pos);

    };


    GuardianChild.prototype.prepareSpawn = function(pos) {
      this.pos = new pjs.PVector();
      this.pos.set(pos);
      this.alpha = 0;
      this.spawning = true;
      this.notified = false;
      switch (this.place) {
      case 0:
        this.pos.sub(player.maxWidth * 5/8, player.maxWidth * 5/8);
        break;
      case 1:
        this.pos.add(player.maxWidth * 9/8, -(player.maxWidth * 5/8));
        break;
      case 2:
        this.pos.add(player.maxWidth * 9/8, player.maxWidth * 9/8);
        break;
      case 3:
        this.pos.sub(player.maxWidth * 5/8, -(player.maxWidth * 9/8));
        break;
      default:
        console.log('wheat');
      }
    };

    GuardianChild.prototype.setParent = function(parent) {
      this.parent = parent;
    };

    GuardianChild.prototype.checkIfHitPlayer = function() {
      if (!this.spawning && !this.dying) {
        collisionCheckPlayerSquare(this);
      }
    };

    GuardianChild.prototype.checkIfShot = function() {
      if (!this.dying) {
        for (var i = 0; i < projectiles.length; i++) {
          if (!projectiles[i].collided) {
            if (collisionCheckProjSquare(projectiles[i], this) === 1 && this.dying) {
              this.parent.numChildren--;
              break;
            }
          }
        }
      }
    };

    GuardianChild.prototype.illustrate = function() {
      pjs.fill(this.red, this.green, this.blue, this.alpha);
      if (!this.dying) {
        if (!this.spawning) {
          if (this.notified) {
            this.alpha -= 2;
          }
        }
        else {
          if (this.alpha < 255) {
            this.alpha += 2;
          }
          else {
            this.spawnTime = pjs.millis();
            this.spawning = false;
          }
        }
      }
      else {
        this.pos.add(this.sizeModifier);
        this.width -= 2;
        this.height -= 2;
        if (this.width <= 0) {
          enemiesToDel.push(this);
          if (this.hit) {
            deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points));
          }
        }
      }
      pjs.rect(this.pos.x, this.pos.y, this.width, this.width);
    };



    function squareSnakeSetup() {
      var maxWidth = player.maxWidth / 2;
      var numMoves = pjs.random(6 * maxWidth, 12 * maxWidth);
      var pos = randomEnemyPos();
      var color = randomEnemyColor();
      var leaderColor = randomEnemyColor();
      if (color === leaderColor) {
        var temp = enemyColors.indexOf(leaderColor);
        if (temp > 0) {
          color = enemyColors[temp - 1];
        } else {
          color = enemyColors[1];
        }
      }
      if (Math.floor(pjs.random(2)) === 0) {
        for (var i = 0; i < 5; i++) {                 //CHANGE HERE
          var temp = new pjs.PVector(0, i*(maxWidth + 10));
          if (pos.y - player.pos.y < 0) {
            var curr = pjs.PVector.sub(pos, temp);
            var vel = new pjs.PVector(0, 2);
          }
          else {
            var curr = pjs.PVector.add(pos, temp);
            var vel = new pjs.PVector(0, -2);
          }
          enemies.push(new SquareSnake(curr, true, numMoves + i*(maxWidth + 10), vel, i*(maxWidth + 10), numMoves, maxWidth, color, leaderColor, extraEnemyHealth));
        }
      }
      else {
        for (var i = 0; i < 5; i++) {           //CHANGE HERE
          var temp = new pjs.PVector(i*(maxWidth + 10), 0);
          if (pos.x - player.pos.x > 0) { 
            var curr = pjs.PVector.add(pos, temp);
            var vel = new pjs.PVector(-2, 0);
          }
          else {
            var curr = pjs.PVector.sub(pos, temp);
            var vel = new pjs.PVector(2, 0);
          }
          enemies.push(new SquareSnake(curr, false, numMoves + i*(maxWidth + 10), vel, i*(maxWidth + 10), numMoves, maxWidth, color, leaderColor, extraEnemyHealth));
        }
      }
    };

    function SquareSnake(pos, verticalNext, moveCount, vel, extraDist, numMoves, maxWidth, color, leaderColor, addHealth) {
      this.pos = pos;
      this.verticalNext = verticalNext;
      this.moveCount = moveCount;
      this.vel = vel;
      this.leaderVelX = vel.x;
      this.leaderVelY = vel.y;
      this.extraDist = extraDist;
      this.numMoves = numMoves;
      this.numAlive = 5;             // CHANGE HERE
      if (this.extraDist > 0) {
        this.leader = false;
      }
      else {
        this.leader = true;
      }

      this.height = 0;
      this.width = 0;
      this.maxWidth = maxWidth;
      this.speed = 2;

      this.spawning = true;
      this.dying = false;
      this.hit = false;


      this.sizeModifier = new pjs.PVector(.5, .5);

      this.color = color;
      this.leaderColor = leaderColor;

      this.flagOne = false;

      this.health = addHealth;
      this.points = (this.health + 1) * 100;
     
    };

    SquareSnake.prototype.checkIfShot = function() {
      if (this.leader && !this.flagOne) {
        if (!this.spawning && !this.dying) {
          for (var i = 0; i < projectiles.length; i++) {
            if (!projectiles[i].collided) {
              if (collisionCheckProjSquare(projectiles[i], this) === 1 && this.dying) {
                break; 
              }
            }
          }
        } 
      }
    };

    SquareSnake.prototype.checkIfHitPlayer = function() {
      if (!this.spawning && !this.dying) {
        if (!player.shielded || this.leader) {
          collisionCheckPlayerSquare(this);
        }
      }
    };

    SquareSnake.prototype.illustrate = function() {
      if (this.leader || this.dying) {
        pjs.fill(this.leaderColor);
        //pjs.fill(pjs.color(165,167,218));
      } 
      else {
        pjs.fill(this.color);
        //pjs.fill(pjs.color(114,125,189));
      }
      if (!this.dying) {
        if (!this.spawning) {
          if (this.moveCount > 0) {
            this.pos.add(this.vel);
            this.moveCount -= 2;
          }
          else {
            if (!this.leader) {
              this.vel.set(this.leaderVelX, this.leaderVelY);
            }
            else {
              if (this.verticalNext) {
                if (this.pos.x - player.pos.x < 0) {
                  this.leaderVelX = this.speed;
                  this.leaderVelY = 0;
                }
                else {
                  this.leaderVelX = -this.speed;
                  this.leaderVelY = 0;
                }
                this.verticalNext = false;
              }
              else {
                if (this.pos.y - player.pos.y) {
                  this.leaderVelY = this.speed;
                  this.leaderVelX = 0;
                }
                else {
                  this.leaderVelY = -this.speed;
                  this.leaderVelX = 0;
                }
                this.verticalNext = true;
              }
              this.vel.set(this.leaderVelX, this.leaderVelY);
              var index = enemies.indexOf(this);
              for (var i = 1; i < this.numAlive; i++) {
                var temp = enemies[index + i];
                temp.leaderVelX = this.leaderVelX;
                temp.leaderVelY = this.leaderVelY;
                temp.verticalNext = this.verticalNext;
              }
            }
            this.moveCount = this.numMoves;
          }
        }
        else {
          if (this.width < this.maxWidth) {
            this.pos.sub(this.sizeModifier);
            this.width += 1;
            this.height += 1;
          }
          else {
            this.spawning = false;
          }
        }
      }
      else {
        if (!this.flagOne && this.hit) {
          this.flagOne = true;
          this.leader = false;
          var temp = enemies.indexOf(this)
          for (var i = 1; i < this.numAlive; i++) {
            enemies[temp + i].numAlive--;
          }
          if (this.numAlive > 1) {
            enemies[temp + 1].leader = true;
          }
        }
        this.pos.add(this.sizeModifier);
        this.width -= 1;
        this.height -= 1;
        if (this.width <= 0) {
          enemiesToDel.push(this);
          if (this.hit) {
            deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points));
          }
        }
      }
      pjs.rect(this.pos.x, this.pos.y, this.width, this.height);
    };



    function divisibleSquareSetup() {
      enemies.push(new LargeDivisibleSquare(extraEnemyHealth));
    }


    function LargeDivisibleSquare(addHealth) {
      this.pos = randomEnemyPos();

      this.height = 0;
      this.width = 0;
      this.maxWidth = player.maxWidth;
      this.speed = player.speed / 2;

      this.vel;

      this.spawning = true;
      this.dying = false;
      this.hit = false;

      this.points = 0;

      this.randomRange = 60;
      this.randomFactor = new pjs.PVector(pjs.random(-this.randomRange, this.randomRange), 
        pjs.random(-this.randomRange, this.randomRange));
      this.randomRangeMod = this.randomRange * rootTwo + 5;

      this.sizeModifier = new pjs.PVector(1, 1);

      this.color = randomEnemyColor();

      this.health = 4 + addHealth;

      this.hitBack = false;
      this.startHitBack;

    };

    LargeDivisibleSquare.prototype.checkIfShot = function() {
      if (!this.spawning && !this.dying) {
        for (var i = 0; i < projectiles.length; i++) {
          if (!projectiles[i].collided) {
            if (collisionCheckProjSquare(projectiles[i], this) === 1 && this.dying) break;
          }
        }
      }
    };
    LargeDivisibleSquare.prototype.checkIfHitPlayer = function() {
      if (!this.spawning && !this.dying) {
        collisionCheckPlayerSquare(this);
      }
    };
    LargeDivisibleSquare.prototype.illustrate = function() {
      pjs.fill(this.color);
        if (this.hitBack && alternateTarget === null) {
          if (pjs.millis() - this.startHitBack > 300) {
            this.hitBack = false;
          }
        }
        if (!this.dying) {
          if (!this.spawning) {
            if (alternateTarget === null) {
              this.vel = pjs.PVector.sub(player.pos, this.pos);
            }
            else {
              this.vel = pjs.PVector.sub(alternateTarget.pos, this.pos);
            }
            var dist = this.vel.mag();
            if (dist > player.radius / 5) {
              if (dist > this.randomRangeMod) {
                this.vel.add(this.randomFactor);
              }
              this.vel.normalize();
              //this.vel.mult(this.speed); this.speed = 1
              if (!this.hitBack) {
                this.pos.add(this.vel);
              }
              else {
                this.vel.mult(-2);
                this.pos.add(this.vel);
                this.vel.mult(-1/2);
              }
            }
          }
          else {
            if (this.width < this.maxWidth) {
              this.pos.sub(this.sizeModifier);
              this.width += 2;
              this.height += 2;
            }
            else {
              this.spawning = false;
            }
          }
        }
        else {
          if (this.hit) {
            for (var i = 0; i < 3; i++) {
              for (var j = 0; j < 3; j++) {
                enemies.push(new DividedSquare(new pjs.PVector(this.pos.x + (i * player.maxWidth / 3), this.pos.y + (j * player.maxWidth / 3)), false, player.maxWidth / 3, extraEnemyHealth));
              }
            }
            enemiesToDel.push(this);
          }
          else {
            this.pos.add(this.sizeModifier);
            this.width -= 2;
            this.height -= 2;
            if (this.width <= 0) {
              enemiesToDel.push(this);
            }
          }
        }
        pjs.rect(this.pos.x, this.pos.y, this.width, this.width);

    };

    function dividedSquareSetup() {
      enemies.push(new DividedSquare(randomEnemyPos(), true, 0, extraEnemyHealth));
      enemies.push(new DividedSquare(randomEnemyPos(), true, 0, extraEnemyHealth));
      enemies.push(new DividedSquare(randomEnemyPos(), true, 0, extraEnemyHealth));
    }

    function DividedSquare(pos, spawning, width, addHealth) {
      this.pos = pos;

      this.height = width;
      this.width = width;
      this.maxWidth = player.maxWidth / 3;
      this.speed = player.speed;

      this.vel;

      this.dying = false;
      this.spawning = spawning;


      //this.randomRange = 120;
      //this.randomFactor = new pjs.PVector(pjs.random(-this.randomRange, this.randomRange), 
        //pjs.random(-this.randomRange, this.randomRange));
      //this.randomRangeMod = this.randomRange * rootTwo + 5;

      this.sizeModifier = new pjs.PVector(.5, .5);

      this.color = randomEnemyColor();

      this.health = addHealth;
      this.points = (this.health + 1) * 100;

      //doesnt need
      // It does now. so fix that.
      this.hitBack = false;
      this.startHitBack;
    
    }

    DividedSquare.prototype.checkIfShot = function() {
      if (!this.spawning && !this.dying) {
        for (var i = 0; i < projectiles.length; i++) {
          if (!projectiles[i].collided) {
            if (collisionCheckProjSquare(projectiles[i], this) === 1 && this.dying) break; 
          }
        }
      }
    };

    DividedSquare.prototype.checkIfHitPlayer = function() {
      if (!this.spawning && !this.dying) {
        collisionCheckPlayerSquare(this);
      }
    };

    DividedSquare.prototype.illustrate = function() {
      pjs.fill(this.color);
      if (this.hitBack && alternateTarget === null) {
        if (pjs.millis() - this.startHitBack > 150) {
          this.hitBack = false;
        }
      }
      if (!this.dying) {
        if (!this.spawning) {
          if (alternateTarget === null) {
            this.vel = pjs.PVector.sub(player.pos, this.pos);
          }
          else {
            this.vel = pjs.PVector.sub(alternateTarget.pos, this.pos);
          } 
          var dist = this.vel.mag();
          if (dist > player.radius / 5) {
            this.vel.normalize();
            this.vel.mult(this.speed);
            if (!this.hitBack) {
              this.pos.add(this.vel);
            }
            else {
              this.vel.mult(-2);
              this.pos.add(this.vel);
              this.vel.mult(-.5);
            }
            //if (dist > this.randomRangeMod) {
             //this.vel.add(this.randomFactor);
            //}
          }
        }
        else {
          if (this.width < this.maxWidth) {
            this.pos.sub(this.sizeModifier);
            this.width += .5;
            this.height += .5;
          }
          else {
            this.spawning = false;
          }
        }
      }
      else {
        this.pos.add(this.sizeModifier);
        this.width -= 1;
        this.height -= 1;
        if (this.width <= 0) {
          enemiesToDel.push(this);
          if (this.hit) {
            deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points)); 
          }
        }
      }
      pjs.rect(this.pos.x, this.pos.y, this. width, this.width);
    };




/*

    var standardTriangleSetup = function() {
      enemies.push(new StandardTriangle());
    }
    var StandardTriangle = function() {
      this.pos = randomEnemyPos();
      this.posLeft;
      this.posRight;

      this.edgeLength = 0;
      //this.maxLength = player.maxWidth;
      this.maxLength = pjs.random(player.maxWidth / 2, player.maxWidth * 1.5)
      this.speed = 3 * player.speed / 4;
      this.vel;

      //this.randomRange = 60;
      //this.randomFactor = new pjs.PVector(pjs.random(-this.randomRange, this.randomRange), 
        //pjs.random(-this.randomRange, this.randomRange));
      //this.randomRangeMod = this.randomRange * rootTwo + 5;

      this.spawning = true;
      this.dying = false;
      this.hit = false;

      this.points = 100;

      this.color = randomEnemyColor();

      this.health = 0;

      //this.health = 0 so it doesnt need these
      //this.hitBack;
      //this.startHitBack;

      this.checkIfHitPlayer = function() {
        if (!this.spawning && !this.dying) {
          collisionCheckPlayerTriangle(this);
        }
      };

      this.checkIfShot = function() {
        if (!this.spawning && !this.dying) {
          for (var i = 0; i < projectiles.length; i++) {
            if (!projectiles[i].collided) {
              if (collisionCheckProjTriangle(projectiles[i], this) === 1 && this.dying) break;
            }
          }
        }
      };

      this.illustrate = function() {
        pjs.fill(this.color);
        if (!this.dying) {
          if (alternateTarget === null) {
            this.vel = pjs.PVector.sub(player.pos, this.pos);
          }
          else {
            this.vel = pjs.PVector.sub(alternateTarget.pos, this.pos);
          }
          var dist = this.vel.mag();  
          if (dist > player.radius / 5) {
            //if (dist > this.randomRangeMod) {
              //this.vel.add(this.randomFactor);
            //}
            this.vel.normalize();
            this.vel.mult(this.speed);
            if (!this.spawning) {
              this.pos.add(this.vel);
            }
            else {
              this.edgeLength += 2;
              if (this.edgeLength >= this.maxLength) {
                this.spawning = false;
              }
            }
          }
        }
        else {
          this.edgeLength -= 2;
          if (this.edgeLength === 0) {
            enemiesToDel.push(this);
            if (this.hit) {
              deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points)); 
            }
          }
        }
    
        var angleZero = Math.atan(this.vel.y/this.vel.x);
        if (this.vel.x < 0) {
          var angleLeft = angleZero + 3 * Math.PI/4 + Math.PI; 
          var angleRight = angleZero - 3 * Math.PI/4 + Math.PI;
        }
        else {
          var angleLeft = angleZero + 3 * Math.PI/4; 
          var angleRight = angleZero - 3 * Math.PI/4;
        }

        var dirLeft = new pjs.PVector(Math.cos(angleLeft), Math.sin(angleLeft));
        var dirRight = new pjs.PVector(Math.cos(angleRight), Math.sin(angleRight)); 

        dirLeft.normalize();
        dirRight.normalize();

        dirLeft.mult(this.edgeLength);
        dirRight.mult(this.edgeLength);

        this.posLeft = new pjs.PVector.add(this.pos, dirLeft);
        this.posRight = new pjs.PVector.add(this.pos, dirRight);

        pjs.triangle(this.pos.x, this.pos.y,
        this.posLeft.x, this.posLeft.y,
        this.posRight.x, this.posRight.y);
      };
    };
*/



    function largeTriangleSetup () {
      enemies.push(new LargeTriangle(extraEnemyHealth));
      enemies.push(new LargeTriangle(extraEnemyHealth));
      enemies.push(new LargeTriangle(extraEnemyHealth));
    }

    function LargeTriangle(addHealth) {

      this.pos = randomEnemyPos();
      this.posLeft;
      this.posRight;

      this.edgeLength = 0;
      this.maxLength = pjs.random(player.maxWidth / 2, player.maxWidth * 1.5);
      this.speed = 3 * player.speed / 4;
      this.vel;

      //this.randomRange = 90;
      //this.randomFactor = new pjs.PVector(pjs.random(-this.randomRange, this.randomRange), 
       // pjs.random(-this.randomRange, this.randomRange));
      //this.randomRangeMod = this.randomRange * rootTwo + 5;

      this.spawning = true;
      this.dying = false;
      this.hit = false;

      this.health = addHealth;
      this.points = (this.health + 1) * 100;

      this.color = randomEnemyColor();

      this.hitBack = false;
      this.startHitBack;
    }

    LargeTriangle.prototype.checkIfHitPlayer = function() {
      if (!this.spawning && !this.dying) {
          collisionCheckPlayerTriangle(this);
      }
    };

    LargeTriangle.prototype.checkIfShot = function() {
      if (!this.spawning && !this.dying) {
        for (var i = 0; i < projectiles.length; i++) {
          if (!projectiles[i].collided) {
            if (collisionCheckProjTriangle(projectiles[i], this) === 1 && this.dying) {
              break;
            }
          }
        }
      }
    };

    LargeTriangle.prototype.illustrate = function() {
      pjs.fill(this.color);
      if (this.hitBack && alternateTarget === null) {
        if (pjs.millis() - this.startHitBack > 300) {
          this.hitBack = false;
        }
      }

      if (!this.dying) {

        if (alternateTarget === null) {
          this.vel = pjs.PVector.sub(player.pos, this.pos);
        }
        else {
          this.vel = pjs.PVector.sub(alternateTarget.pos, this.pos);
        }

        var dist = this.vel.mag();  
        if (dist > player.radius / 5) {
          //if (dist > this.randomRangeMod) {
            //this.vel.add(this.randomFactor);
          //}
          this.vel.normalize();
          this.vel.mult(this.speed);
          if (!this.spawning) {
            if (!this.hitBack) {
              this.pos.add(this.vel);
            }
            else {
              this.vel.mult(-2);
              this.pos.add(this.vel);
              this.vel.mult(-1/2);
            }
          }
          else {
            this.edgeLength += 2;
            if (this.edgeLength >= this.maxLength) {
              this.spawning = false;
            }
          }
        }
      }
      else {
        this.edgeLength -= 2;
        if (this.edgeLength === 0) {
          enemiesToDel.push(this);
          if (this.hit) {
          deadPointArr.push(new DeadPoint(this.pos.x, this.pos.y, this.points)); 
          }
        }
      }
  
      var angleZero = Math.atan(this.vel.y/this.vel.x);
      if (this.vel.x < 0) {
        var angleLeft = angleZero + 3 * Math.PI/4 + Math.PI; 
        var angleRight = angleZero - 3 * Math.PI/4 + Math.PI;
      }
      else {
        var angleLeft = angleZero + 3 * Math.PI/4; 
        var angleRight = angleZero - 3 * Math.PI/4;
      }

      var dirLeft = new pjs.PVector(Math.cos(angleLeft), Math.sin(angleLeft));
      var dirRight = new pjs.PVector(Math.cos(angleRight), Math.sin(angleRight)); 

      dirLeft.normalize();
      dirRight.normalize();

      dirLeft.mult(this.edgeLength);
      dirRight.mult(this.edgeLength);

      this.posLeft = new pjs.PVector.add(this.pos, dirLeft);
      this.posRight = new pjs.PVector.add(this.pos, dirRight);

      pjs.triangle(this.pos.x, this.pos.y,
        this.posLeft.x, this.posLeft.y,
        this.posRight.x, this.posRight.y);

    };

  };
