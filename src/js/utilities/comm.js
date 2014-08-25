var Comm = function(protocol) {

    this.socket = io.connect(window.location.href);

    this.socket.on("controlled", function() {
        protocol.sendControlled();
    });

    this.socket.on("mobile says start", function() {
        protocol.sendControllerStart();
    });

    this.socket.on("set play again", function(data) {
        protocol.sendPlayAgain(data.leaderBoard);
    });

    this.socket.on("enter name", function(data) {
        var name = prompt("enter name to submit score");
        protocol.sendEnterName(name);
    });

};

Comm.prototype.emitNewRoom = function(roomId) {
    this.socket.emit("init room", {"roomId": roomId});
};

Comm.prototype.emitControllerConnect = function(roomId, callback) {
    this.socket.emit("controller connect", {"roomId": roomId}, function(data) {
        callback && callback(data);
    });
};

Comm.prototype.emitControllerStart = function(roomId) {
    console.log("controller start");
    this.socket.emit("controller start", {"roomID": roomId});
};

Comm.prototype.emitGameOver = function(roomId, score) {
    console.log(roomId);
    console.log(score);
    this.socket.emit("game over", {"roomID": roomId, "score": score});
};

Comm.prototype.emitSubmitScore = function(roomId, name, score) {
    this.socket.emit("submit score", {
        "roomId": roomId, 
        "playerName": name,
        "score": score
    });
};

module.exports = Comm;