var IdGenerator = require("./utilities/idGenerator");
var Comm = require("./utilities/comm");
var playTemplate = require("../hbs/play.hbs");
var connectTemplate = require("../hbs/connect.hbs");
var controlledTemplate = require("../hbs/controlled.hbs");

var main = function() {

    var controlled = false;
    var protocol = {
        tellControlled: function() {
            console.log("happening");
            controlled = true;
            document.body.innerHTML = controlledTemplate();
        }
    };
    var socket = io.connect(window.location.href);
    var comm = new Comm(socket, protocol);
    var roomId;

    document.getElementById("play").onclick = function() {
        roomId = IdGenerator.getId();
        comm.emitNewRoom(roomId);
        document.body.innerHTML = playTemplate({"roomId": roomId});
    };

    document.getElementById("control").onclick = function() {
        roomId = prompt('enter room id');
        comm.emitConnectController(roomId, function(data) {
            if (data.success) {
                document.body.innerHTML = connectTemplate({"roomId": roomId});
            } else {
                alert("invalid room id");
            }
        });
    };

    document.getElementById("help").onclick = function() {
        console.log("help clicked");
    };

    setTimeout(function() {
        console.log("happening");
        console.log(controlled);
    }, 10000);

};

main();