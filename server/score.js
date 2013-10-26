var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var scoreSchema = new Schema({
  _id: Schema.ObjectId,
  name: String,
  score: Number
});

scoreSchema.statics.findTopTen = function(callback) {
    console.log('so this is getting called');
  this.find().sort({score: -1}).limit(10).exec(callback);
};

scoreSchema.statics.addScore = function(name, score, callback) {
  var scoreData = {
    name: name,
    score: score
  }
  var newScore = new Score(scoreData);
  newScore.save(function(err) {
    if (err) console.log('error saving');
  });
  callback();
};

var Score = module.exports = mongoose.model('Score', scoreSchema);
