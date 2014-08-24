var Comm = function(socket) {
    this.socket = socket;
};

Comm.prototype.emitNewRoom = function(roomId) {
    this.socket.emit("new room", {"roomID": playComm.roomId});
};

Comm.prototype.emitConnectController = function(roomId, callback) {
    this.socket.emit("connect mobile", {"roomID": roomId}, callback(data));
};

module.exports = Comm;