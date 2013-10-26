var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shapes');

var score = require('./score');

module.exports.Score = score;
