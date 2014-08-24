var playComm = {};
playComm.controlled = false;
playComm.name = null;

playComm.startCanvas = function() {
  JQbody.html("<canvas id='view' tabindex='1'></canvas>");
  var canvas = document.getElementById('view');
  canvas.focus();
  playComm.processingInstance = new Processing(canvas, view);
};

JQdoc.on('click', '#start', function() {
  playComm.startCanvas();
});

JQdoc.on('click', '#uncontplayagain', function() {
  playComm.startCanvas();
});

socket.on('controlled', function() {
  JQbody.html("<div class='a'></div>" +
    "<div class='option'>TITLE</div>" + 
    "<div class='b'></div>" +
    "<div class='option'>id " + playComm.roomID + "</div>" +
    "<div class='b'></div>" +
    "<div class='option'>use controller</div>" +
    "<div class='b'></div>" +
    "<div class='option'>to start</div>" +
    "<div class ='a'></div>"
  );
  playComm.controlled = true;
});

socket.on('mobile says play again', function() {
  playComm.startCanvas();
});

socket.on('mobile says start', function() {
  playComm.startCanvas();
});

socket.on('display high scores', function(data) {
  playComm.playAgainCont(data.scores);
});

socket.on('display desk play again', function(data) {
  playComm.playAgainUncont(data.scores);
});


playComm.playAgainCont = function(scores) {
  playComm.processingInstance.exit();
  playComm.processingInstace = null;
  
  var page = "<div class='a'></div><div class='option'>TITLE</div><div class='b'></div><div class='option'>game over</div><div class='b'></div><div class='longtext'>leaders<br>";
  //var page = "<div class='option'>TITLE</div><div class='b'></div><div id='longtext'>leaders<br>";
  for (var i = 0; i < scores.length; i++) {
    page += scores[i].name + " " + scores[i].score + "<br>";
  }
  page += "</div><div class='b'></div><div class='option button'>more projects</div><div class='a'></div>";
  
  JQbody.html(page);
};

playComm.playAgainUncont = function(scores) {
  playComm.processingInstance.exit();
  playComm.processingInstace = null;
  
  var page = "<div class='a'></div><div class='option'>TITLE</div><div class='b'></div><div class='option button' id='uncontplayagain'>play again</div><div class='b'></div><div class='longtext'>leaders<br>";
  //var page = "<div class='option'>TITLE</div><div class='b'></div><div id='longtext'>leaders<br>";
  for (var i = 0; i < scores.length; i++) {
    page += scores[i].name + " " + scores[i].score + "<br>";
  }
  page += "</div><div class='b'></div><div class='option button'>more projects</div><div class='a'></div>";
  
  JQbody.html(page);
};

playComm.tellContGameOver = function(score) {
  socket.emit('game over', {roomID: playComm.roomID, 'score': score});
};

playComm.submitScore = function(score) {
  if (playComm.name === null || playComm.name === '') {
    playComm.name = prompt('enter name to submit score');
  }
  console.log(playComm.name);
  socket.emit('name entered from desk', {roomID: playComm.roomID, 'playerName':playComm.name, 'score': score});
}

