var fs        = require('fs');
var path      = require('path');
var strRepeat = require('./helpers').strRepeat;
var duration  = require('./helpers').duration;
var qz        = require('./helpers').quantize;
var c         = require('./helpers').c;

var fn = path.resolve(home(), '.pomo_stat');

module.exports = function(percent, elapsed, remaining, mode) {
  var str = get.apply(this, arguments);

  fs.writeFile(fn, str, function(err) {
    if (err) throw err;
  });
};

function get(percent, elapsed, remaining, mode) {
  if (percent === null) return '';

  var color = (mode === 'break' ? 32 : 34);
  var dot = '⋅';
  var peg = '◦';
  var check = '✔';

  var len = 10;
  var left = parseInt(len * percent, 10);
  var right = len - left;

  var progress =
    strRepeat(dot, left) +
    peg +
    strRepeat(dot, right);

  var dur = duration(qz(remaining));

  return dur + '  ' + progress;

}

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

