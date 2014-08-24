var Comm = function(socket, protocol) {
    this.socket = socket;

    this.socket.on("controlled", function() {
        protocol.tellControlled();
    });

};

Comm.prototype.emitNewRoom = function(roomId) {
    this.socket.emit("new room", {"roomID": roomId});
};

Comm.prototype.emitConnectController = function(roomId, callback) {
    this.socket.emit("connect mobile", {"roomID": roomId}, function(data) {
        callback && callback(data);
    });
};

module.exports = Comm;