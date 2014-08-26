var $ = require("jquery-browserify");
var IdGenerator = require("./utilities/idGenerator");
var Comm = require("./utilities/comm");
var View = require("./utilities/view");

var main = function() {

    var roomId = null;
    var controlled = false;
    var processingInstance = null;
    var name = null;

    var commProtocol = {
        sendControlled: function() {
            controlled = true;
            view.setControlled(roomId);
        },
        sendControllerStart: function() {
            view.setStart();
        },
        sendPlayAgain: function(leaderBoard) {
            if (controlled) {
                view.setPlayAgainControlled(leaderBoard);
            } else {
                view.setPlayAgain(leaderBoard);
            }
        },
        sendControllerPlayAgain: function() {
            view.setControllerPlayAgain();
        },
        sendEnterName: function(name) {
            comm.emitSubmitScore(roomId, name);
            view.setControllerPlayAgain();
        }
    };
    var comm = new Comm(commProtocol);

    var viewProtocol = {
        sendProcessingInstance: function(instance) {
            processingInstance = instance;
            processingInstance.protocol = gameProtocol;
        }
    };
    var view = new View(viewProtocol);

    var gameProtocol = {
        sendGameOver: function(score) {
            console.log("THERES A GAME OVER");
            processingInstance.exit();
            if (controlled) {
                console.log("controlled so emitting game over");
                comm.emitGameOver(roomId, score);
            } else {
                console.log("not controlled so asking for name or using saved name");
                if (name === null || name === "") {
                    name = prompt("enter name to submit score");
                }
                comm.emitSubmitScore(roomId, name, score);
            }
        }
    };

    $(document).on("click", "#play", function() {
        roomId = IdGenerator.getId();
        comm.emitNewRoom(roomId);
        view.setPlay(roomId);
    });

    $(document).on("click", "#control", function() {
        roomId = prompt('enter room id');
        comm.emitControllerConnect(roomId, function(data) {
            if (data.success) {
                view.setControl(roomId);
            } else {
                alert("invalid room id");
            }
        });
    });

    $(document).on("click", "#start", function() {
        view.setStart();
    });

    $(document).on("click", "#controller-start", function() {
        view.setControllerStart();
        comm.emitControllerStart(roomId);
    });

    $(document).on("click", "#help", function() {
        view.setHelp();
    });

    $(document).on("click", "#back", function() {
        view.setIndex();
    });

    $(document).on("click", "#play-again", function() {
        view.setStart();
    });

    $(document).on("click", "#controller-play-again", function() {
        view.setControllerStart();
        comm.emitControllerStart(roomId);
    });

};

main();