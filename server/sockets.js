var idToRoom = {}; 

var Room = function(roomID, roomSocket) {
  this.roomID = roomID;
  this.roomSocket = roomSocket;
  this.contSocket = null;
  this.playerName = null;
};

var connect = function(socket) {

// before
/*******************************************************************************************************/

    socket.on("init room", function(data) {
        idToRoom[data.roomId] = new Room(data.roomId, socket);
    });

    socket.on("controller connect", function(data, callback) {
        var room = idToRoom[data.roomId];
        if (room && !room.contSocket) {
            room.contSocket = socket;
            room.roomSocket.emit("controlled");
            callback({"success": true});
        } else {
            callback({"success": false});
        }
    });

    socket.on('controller start', function(data) {
        idToRoom[data.roomID].roomSocket.emit('mobile says start');
    });

// during
/*******************************************************************************************************/

    socket.on('right stick move', function(data) {
        var roomSocket = idToRoom[data.roomID].roomSocket;
        if (!roomSocket.disconnected) {
            roomSocket.emit('right stick move', {vel: data.vel});
        } else {
            socket.emit('room disconnected')
        }
    });


      socket.on('right stick stop', function(data) {
        var roomSocket = idToRoom[data.roomID].roomSocket;
        if (!roomSocket.disconnected) {
          roomSocket.emit('right stick stop');
        }
        else {
          socket.emit('room disconnected')
        }
      });
      // the following receive the left stick data from the controller and passes it to the game
      socket.on('left stick move', function(data) {
        var roomSocket = idToRoom[data.roomID].roomSocket;
        if (!roomSocket.disconnected) {
          roomSocket.emit('left stick move', {'currVector': data.currVector, 'distPercent': data.distPercent});
        }
        else {
          socket.emit('room disconnected')
        }
      });

      socket.on('left stick stop', function(data) {
        var roomSocket = idToRoom[data.roomID].roomSocket;
        if (!roomSocket.disconnected) {
          roomSocket.emit('left stick stop');
        }
        else {
          socket.emit('room disconnected')
        }
      });

// after
/*******************************************************************************************************/

    socket.on("game over", function(data) {
        var room = idToRoom[data.roomID];
        if (!room.playerName) {
            room.score = data.score;
            room.contSocket.emit("enter name");
        } else {
            // save score and get leaders get high scores
            room.roomSocket.emit("set play again", {"leaderBoard": [{"name": "mason", "score": 5000}, {"name": "allie", "score": "100"}]});
            room.contSocket.emit("set controller play again");
        }
    });

    socket.on('name entered from cont', function(data) {
        if (!(data.name === '' || data.name === null)) {
            idToRoom[data.roomID].roomSocket.emit('display high scores', {'scores': scores});
            idToRoom[data.roomID].playerName = data.name;
        }
    });

    socket.on('play again from mobile', function(data) {
        idToRoom[data.roomID].roomSocket.emit('mobile says play again');
    });

    socket.on("submit score", function(data) {
        console.log("received a score");
        console.log(data);
        var room = idToRoom[data.roomId];
        console.log(idToRoom);
        console.log(room);
        if (data.playerName !== "") {
            //add score to database
            room.playerName = data.playerName;
        };
        //get top scores
        console.log("about to tell room to play again");
        room.roomSocket.emit("set play again", {"leaderBoard": [{"name": "mason", "score": 5000}, {"name": "allie", "score": "100"}]});
    });
/*******************************************************************************************************/

};

// the following is the initialization of the sockets 
module.exports = {
    init: function(io) {
        io.sockets.on('connection', connect);
    }
};

