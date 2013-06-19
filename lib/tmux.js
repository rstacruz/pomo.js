var fs        = require('fs');
var path      = require('path');
var strRepeat = require('./helpers').strRepeat;
var duration  = require('./helpers').duration;
var qz        = require('./helpers').quantize;

var fn = path.resolve(home(), '.pomo_stat');

module.exports = function(mode, percent, elapsed, remaining) {
  var str = get.apply(this, arguments);

  // Do it synchronously at the end to ensure sequential-ness
  if (+remaining < 5000)
    fs.writeFileSync(fn, str);
  else
    fs.writeFile(fn, str, function(err) { if (err) throw(err); });
};

function get(mode, percent, elapsed, remaining) {
  elapsed = qz(elapsed);
  remaining = qz(remaining);

  if (percent === null) return ' ';
  if (+remaining === 0 && mode === 'snack') return '';

  var color = (mode === 'snack' ? 2 : 4);
  var dot = '⋅';
  var peg = '◦';
  var check = '✔';

  var len = 8;
  var left = parseInt(len * percent, 10);
  var right = len - left;

  var progress =
    '#[fg=0]' +
    strRepeat(dot, left) +
    '#[fg='+color+']' +
    peg +
    '#[fg=0]' +
    strRepeat(dot, right);

  var dur = '';

  if (+remaining > 0 && elapsed > 0)
    dur = '#[fg='+color+']' +
      duration(remaining).replace(/ .*$/, '');

  return dur + '  ' + progress + '#[fg=0]';

}

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

