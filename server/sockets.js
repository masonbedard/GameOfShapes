var rooms = {}; 

//var socketsToIds = {};

var room = function(roomID, roomSocket) {
  this.roomID = roomID;
  this.roomSocket = roomSocket;
  this.contSocket = null;
  this.playerName = null;
};

// the following is what the socket for each connected client waits for
var connect = function(socket) {


    console.log("connection");

/*
  socket.on('disconnect', function() {
    console.log('hello');
    console.log(socketsToIds);
    var curr = rooms[socketsToIds[socket]];
    if (typeof curr !== undefined && curr !== null) {
      if (curr.contSocket.disconnected) {
        console.log("HEREE IT IS ");
      }
    }
  });

// the following are used for connecting a controller and starting the game
/*******************************************************************************************************/


  // the following will occur if the client creates a room
  socket.on('new room', function(data) {
    rooms[data.roomID] = new room(data.roomID, socket);
    //socketsToIds[socket] = data.roomID;
    console.log(rooms);
  });

  // the following will occur if the client tries to join a room
  socket.on('connect mobile', function(data, callback) {
    console.log("CONNECTING mobile");
    var desktopRoom = rooms[data.roomID];
    if (typeof desktopRoom !== 'undefined' && desktopRoom.contSocket === null) {
      rooms[data.roomID].roomSocket.emit('controlled', {roomID: data.roomID});
      rooms[data.roomID].contSocket = socket;
      //socketsToIds[socket] = data.roomID;
      callback({'success':true});
    }
    else {
      callback({'success':false});
    }
  });

  // the following will occur if the mobile has been connected and is saying to start
  socket.on('start from mobile', function(data) {
    rooms[data.roomID].roomSocket.emit('mobile says start');
  });

//back functionality removed
/*******************************************************************************************************/
  // the following handle if either the desktop or mobile says back from the title menu or pause menu
/*
  socket.on('desktop back', function(data) {
    console.log('before');
    console.log(rooms);
    console.log(typeof rooms);
    console.log(typeof rooms[data.roomID]);
    if (rooms[data.roomID].contSocket !== null) {
      rooms[data.roomID].contSocket.emit('desktop says back');
    }
    delete rooms[data.roomID];
    console.log('after');
    console.log(rooms);
    /*
    if (rooms[data.roomID].contSocket !== null) {
      rooms[data.roomID].contSocket.emit('desktop says back');
    }*/
/*
    console.log('desktop back');
  });

  socket.on('mobile back', function(data) {
    rooms[data.roomID].roomSocket.emit('mobile says back');
    rooms[data.roomID].contSocket = null;
    console.log(rooms);
  });

/*******************************************************************************************************/







// the following are used for communication from the controller to the desktop during game
/*******************************************************************************************************/

  socket.on('right stick move', function(data) {
    var roomSocket = rooms[data.roomID].roomSocket;
    if (!roomSocket.disconnected) {
      roomSocket.emit('right stick move', {vel: data.vel});
    }
    else {
      socket.emit('room disconnected')
    }
  });
  socket.on('right stick stop', function(data) {
    var roomSocket = rooms[data.roomID].roomSocket;
    if (!roomSocket.disconnected) {
      roomSocket.emit('right stick stop');
    }
    else {
      socket.emit('room disconnected')
    }
  });
  // the following receive the left stick data from the controller and passes it to the game
  socket.on('left stick move', function(data) {
    var roomSocket = rooms[data.roomID].roomSocket;
    if (!roomSocket.disconnected) {
      roomSocket.emit('left stick move', {'currVector': data.currVector, 'distPercent': data.distPercent});
    }
    else {
      socket.emit('room disconnected')
    }
  });

  socket.on('left stick stop', function(data) {
    var roomSocket = rooms[data.roomID].roomSocket;
    if (!roomSocket.disconnected) {
      roomSocket.emit('left stick stop');
    }
    else {
      socket.emit('room disconnected')
    }
  });

/*******************************************************************************************************/





// the following are for a game that's completed
/*******************************************************************************************************/

  socket.on('game over', function(data) {
      console.log('game over');
    var room = rooms[data.roomID];
    if (room.playerName === null) {
      room.contSocket.emit('enter name', {'score': data.score});
      console.log('asked for name');
    }
    else {
      Score.addScore(data.playerName, data.score, function() {
        Score.findTopTen(function(scores) {
          socket.emit('display high scores', {'scores': scores});
          room.contSocket.emit('name already entered');
        })
      });
    }
  });

  socket.on('name entered from cont', function(data) {
    if (!(data.name === '' || data.name === null)) {
      Score.addScore(data.playerName, data.score, function() {
        Score.findTopTen(function(scores) {
          rooms[data.roomID].roomSocket.emit('display high scores', {'scores': scores});
        })
      });
      rooms[data.roomID].playerName = data.name;
    }
  });

  socket.on('play again from mobile', function(data) {
    rooms[data.roomID].roomSocket.emit('mobile says play again');
  });

  socket.on('name entered from desk', function(data) {
      console.log('received name from desk');
      console.log(data.playerName);
    if (!(data.playerName === '' || data.playerName === null)) {
      Score.addScore(data.playerName, data.score, function() {
          console.log('getting into first callback');
        Score.findTopTen(function(err, results) {
            console.log(results);

          socket.emit('display desk play again', {'scores':results});
        })
      });
      rooms[data.roomID].playerName = data.playerName;
    }
    else {
      Score.findTopTen(function(err, results) {
        socket.emit('display desk play again', {'scores':results});
      })
    }
  });
/*******************************************************************************************************/

}





// the following is the initialization of the sockets 
module.exports = {
  init: function(io) {
    io.sockets.on('connection', connect);
  }
};

