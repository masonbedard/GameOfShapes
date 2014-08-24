var IdGenerator = require("./utilities/idGenerator");
var Comm = require("./utilities/comm");
var playTemplate = require("../hbs/play.hbs");

var main = function() {

    var roomId = IdGenerator.getId();

    document.getElementById("play").onclick = function() {
        console.log("clicked");
        document.body.innerHTML = playTemplate();
    };

    document.getElementById("control").onclick = function() {
        console.log("control clicked");
        if (data.registered) {
                JQbody.html("<div class='a'></div>" +
                  "<div class='option'>TITLE</div>" +
                  "<div class='b'></div>" +
                  "<div class='option'>id " + contComm.roomID + "</div>" +
                  "<div class='b'></div>" +
                  "<div class='option'>connected</div>" +
                  "<div class='b'></div>" +
                  "<div class='option button' id='mobilestart'>start</div>" +
                  "<div class ='a'></div>"
                );
              }
              else {
                alert('invalid room id');
              }
    };

    document.getElementById("help").onclick = function() {
        console.log("help clicked");
    };

};

main();