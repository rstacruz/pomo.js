var strRepeat = require('./helpers').strRepeat;
var duration  = require('./helpers').duration;
var c         = require('./helpers').c;
var format    = require('util').format;

module.exports = function(perc, elapsed, remaining, color) {
  var dot = '⋅';
  var peg = '✈';

  var len = 50;
  var left = parseInt(len * perc, 10);
  var right = len - left;

  // Progress bar
  var progress = 
    c(color, strRepeat(dot, left)) +
    peg +
    c(color, strRepeat(dot, right));

  var line = '';
  line += "    " + progress + "  ";

  // Start
  if (elapsed === 0) {
    line += c(color, '-');

  // Finished
  } else if (remaining === 0) {
    line += c(color, duration(elapsed));

  // Last few seconds
  } else if (remaining < 60000) {
    line += c(31, 'last ' + duration(remaining).replace(/ .*$/, ''));

  // All else
  } else {
    line += c(color, duration(elapsed));
    if (elapsed >= 1000) {
      line += c(30, ' ' + dot + ' ' + duration(remaining).replace(/ .*$/, '') + ' left');
    }
  }

  // Clear it out and print
  process.stdout.write("\r" + strRepeat(' ', 79) + "\r" + line + ' ');
  if (perc === 1) process.stdout.write("\n");
};
