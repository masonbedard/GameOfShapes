var indexTemplate = require("../../hbs/index.hbs");
var playTemplate = require("../../hbs/play.hbs");
var controlTemplate = require("../../hbs/control.hbs");
var controlledTemplate = require("../../hbs/controlled.hbs");
var gameTemplate = require("../../hbs/game.hbs");
var controllerTemplate = require("../../hbs/controller.hbs");
var helpTemplate = require("../../hbs/help.hbs");
var playAgainTemplate = require("../../hbs/playAgain.hbs");
var playAgainControlledTemplate = require("../../hbs/playAgainControlled.hbs");
var controllerPlayAgainTemplate = require("../../hbs/controllerPlayAgain.hbs");
var initGame = require("../game/game");
var initController = require("../game/controller");

var View = function(protocol) {
    this.protocol = protocol;
};

View.prototype.setIndex = function() {
    document.body.innerHTML = indexTemplate();
}

View.prototype.setPlay = function(roomId) {
    document.body.innerHTML = playTemplate({"roomId": roomId});
};

View.prototype.setControl = function(roomId) {
    document.body.innerHTML = controlTemplate({"roomId": roomId});
};

View.prototype.setControlled = function(roomId) {
    console.log("setting controlled in view");
    document.body.innerHTML = controlledTemplate({"roomId": roomId});
};

View.prototype.startProcessing = function(canvas, processingFunction) {
    canvas.focus();
    this.protocol.sendProcessingInstance(new Processing(canvas, processingFunction));
};

View.prototype.setControllerStart = function() {
    document.body.innerHTML = controllerTemplate();
    this.startProcessing(document.getElementById("controller"), initController);
};

View.prototype.setStart = function() {
    document.body.innerHTML = gameTemplate();
    this.startProcessing(document.getElementById("game"), initGame);
};

View.prototype.setHelp = function() {
    document.body.innerHTML = helpTemplate();
};

View.prototype.setPlayAgain = function(leaderBoard) {
    document.body.innerHTML = playAgainTemplate({"leaderBoard": leaderBoard});
};

View.prototype.setPlayAgainControlled = function(leaderBoard) {
    document.body.innerHTML = playAgainControlledTemplate({"leaderBoard": leaderBoard});
};

View.prototype.setControllerPlayAgain = function() {
    document.body.innerHTML = controllerPlayAgainTemplate();
};

module.exports = View;