var strRepeat = require('./helpers').strRepeat;
var duration  = require('./helpers').duration;
var c         = require('./helpers').c;
var format    = require('util').format;

module.exports = function(perc, elapsed, remaining, color) {
  // Done
  if (perc === 1) {
    process.stdout.write("\r" + strRepeat(' ', 79));
    process.stdout.write("\n");
  }

  // Progress
  else {
    var dot = '⋅';
    var peg = '✈';

    var len = 50;
    var left = parseInt(len * perc, 10);
    var right = len - left;

    process.stdout.write("\r" + strRepeat(' ', 79));
    process.stdout.write(format(
      "\r    %s%s%s  %s %s ",
      c(color, strRepeat(dot, left)),
      peg,
      c(color, strRepeat(dot, right)),

      c(color, duration(elapsed)),
      remaining > 1000 ? c(30, dot + ' ' + duration(remaining).replace(/ .*$/, '') + ' left') : ''
      ));
  }
};
