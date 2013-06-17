var strRepeat = require('./helpers').strRepeat;
var c         = require('./helpers').c;

exports.progress = function(perc, msg, color) {
  var dot = '⋅';
  var peg = '✈';

  var len = 50;
  var progress =
    c(color, strRepeat(dot, len * perc)) +
    peg +
    c(color, strRepeat(dot, len * (1.0-perc)));

  process.stdout.write("\r   " + progress + '  ' + c(color, msg) + ' ');
};

exports.done = function() {
  process.stdout.write("\n");
};
