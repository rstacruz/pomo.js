var strRepeat = require('../lib/helpers').strRepeat;
var duration  = require('../lib/helpers').duration;
var qz        = require('../lib/helpers').quantize;
var c         = require('../lib/helpers').c;
var format    = require('util').format;

module.exports = function(mode, percent, elapsed, remaining) {
  if (mode === null) return;

  var color = (mode === 'snack' ? 32 : 34);
  var dot = '⋅';
  var peg = '✈';
  var check = '✔';

  var len = 50;
  var left = parseInt(len * percent, 10);
  var right = len - left;

  // The thing in the middle
  var glyph = ((percent === 1) ? c(color, dot) : peg);

  // Progress bar
  var progress = 
    c(color, strRepeat(dot, left)) +
    glyph +
    c(color, strRepeat(dot, right));

  var line = '';
  line += "    " + progress + ' ';

  // Quant
  elapsed = qz(elapsed);
  remaining = qz(remaining);

  // Start
  if (percent === 0) {
    line += '';

  // Finished
  } else if (percent === 1) {
    line += ' ' + c(color, duration(elapsed));
    line += '  ' + c(32, check);

  // Last few seconds
  } else if (remaining < 60000) {
    line += ' ' + c(31, 'last ' + duration(remaining).replace(/ .*$/, ''));

  // All else
  } else {
    line += ' ' + c(color, duration(elapsed));
    if (elapsed >= 1000) {
      line += ' ' + c(30, dot + ' ' + duration(remaining).replace(/ .*$/, '+') + ' left');
    }
  }

  // Clear it out and print
  process.stdout.write("\033[2K\r" + line + ' ');
  if (percent === 1) process.stdout.write("\n");
};
