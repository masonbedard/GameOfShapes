var $ = require("jquery-browserify");
var IdGenerator = require("./utilities/idGenerator");
var Comm = require("./utilities/comm");
var View = require("./utilities/view");

var main = function() {

    var socket = io.connect(window.location.href);
    var roomId;
    var controlled = false;
    var processingInstance = null;

    var commProtocol = {
        tellControlled: function() {
            controlled = true;
            view.setControlled(roomId);
        }
    };
    var comm = new Comm(socket, commProtocol);

    var viewProtocol = {
        tellProcessingInstance: function(instance) {
            console.log("setting it");
            processingInstance = instance;
        }
    };
    var view = new View(viewProtocol);

    $(document).on("click", "#play", function() {
        roomId = IdGenerator.getId();
        comm.emitNewRoom(roomId);
        view.setPlay(roomId);
    });

    $(document).on("click", "#control", function() {
        roomId = prompt('enter room id');
        comm.emitConnectController(roomId, function(data) {
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

};

main();