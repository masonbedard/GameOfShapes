var contComm = {};

socket.on('enter name', function(data) {
  var name = prompt('enter name to submit score');
  socket.emit('name entered from cont', {'roomID': contComm.roomID, 'name': name, 'score': data.score});
  contComm.playAgainCont();
});

socket.on('room disconnected', function() {
  contComm.processingInstance.exit();
  alert('lost connection');
  JQbody.html("<div class='a'></div>" +
    "<div class='option'>TITLE</div>" +
    "<div class='b'></div>" +
    "<div class='option button' id='play'>play</div>" +
    "<div class='b'></div>" +
    "<div class='option button' id='control'>control</div>" +
    "<div class='b'></div>" +
    "<div class='option button' id='help'>help</div>" +
    "<div class ='a'></div>"
  );
});

socket.on('name already entered', function() {
  contComm.playAgainCont();
});

JQdoc.on('click', '#mobilestart', function() {
  socket.emit('start from mobile', {roomID: contComm.roomID});
  contComm.startCanvas();
});

JQdoc.on('click', '#playagaincont', function() {
  socket.emit('play again from mobile', {roomID: contComm.roomID});
  contComm.startCanvas();
});

contComm.playAgainCont = function() {
  contComm.processingInstance.exit();
  JQbody.html("<div class='a'></div>" +
      "<div class='option'>TITLE</div>" +
      "<div class='b'></div>" +
      "<div class='option'>game over</div>" +
      "<div class='b'></div>" +
      "<div class='option button' id='playagaincont'>play again</div>" +
      "<div class='b'></div>" +
      "<div class='option button'>more projects</div>" +
      "<div class ='a'></div>"
  );
};

contComm.startCanvas = function() {
  JQbody.html("<canvas id='cont' tabindex='1'><canvas>");
  var canvas = document.getElementById("cont");
  canvas.focus();
  contComm.processingInstance = new Processing(canvas, control);
};

