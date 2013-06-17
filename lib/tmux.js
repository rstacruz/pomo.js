var fs        = require('fs');
var path      = require('path');
var strRepeat = require('./helpers').strRepeat;
var duration  = require('./helpers').duration;
var qz        = require('./helpers').quantize;

var fn = path.resolve(home(), '.pomo_stat');

module.exports = function(percent, elapsed, remaining, mode) {
  var str = get.apply(this, arguments);

  fs.writeFile(fn, str, function(err) {
    if (err) throw err;
  });
};

function get(percent, elapsed, remaining, mode) {
  elapsed = qz(elapsed);
  remaining = qz(remaining);

  if (percent === null) return '';
  if (+remaining === 0) return '';

  var color = (mode === 'break' ? 2 : 4);
  var dot = '⋅';
  var peg = '◦';
  var bigdot = '•';
  var check = '✔';

  var len = 8;
  var left = parseInt(len * percent, 10);
  var right = len - left;

  var progress =
    '#[fg='+color+']' +
    strRepeat(dot, left) +
    peg +
    '#[fg='+color+']' +
    strRepeat(dot, right) +
    '#[fg=0]';

  var dur =
    '#[fg='+color+']' +
    duration(remaining);

  return dur + '  ' + progress + '#[fg=0]';

}

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

