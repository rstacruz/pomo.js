var strRepeat = require('./helpers').strRepeat;
var c         = require('./helpers').c;

module.exports = function(perc, msg, color) {
  // Done
  if (perc === 1) {
    process.stdout.write("\n");
  }

  // Progress
  else {
    var dot = '⋅';
    var peg = '✈';

    var len = 50;
    var left = parseInt(len * perc, 10);
    var right = len - left;

    var progress =
      c(color, strRepeat(dot, left)) +
      peg +
      c(color, strRepeat(dot, right));

    process.stdout.write("\r    " + progress + '  ' + c(color, msg) + ' ');
  }
};
