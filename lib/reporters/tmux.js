var fs        = require('fs');
var path      = require('path');
var strRepeat = require('../../lib/helpers').strRepeat;
var duration  = require('../../lib/helpers').duration;
var qz        = require('../../lib/helpers').quantize;


/**
 * Tmux reporter.
 */

exports.extend = function(pomo, filename) {
  var self = this;
  var fn = path.resolve(home(), filename);

  pomo.on({
    'timer': function(mode, percent, elapsed, remaining) {
      var str = self.get.apply(this, arguments);

      fs.writeFile(fn, str, function(err) { if (err) throw(err); });
    },

    'exit': function() {
      fs.writeFileSync(fn, '');
    }
  });
};

/**
 * Returns the timer msg
 */

exports.get = function(mode, percent, elapsed, remaining) {
  var dot = '⋅';
  var peg = '◦';
  var check = '✔';
  var len = 8;

  elapsed = qz(elapsed);
  remaining = qz(remaining);

  var color = (mode === 'snack' ? 2 : 4);
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

  if (+remaining > 0 && +elapsed > 0)
    dur = '#[fg='+color+']' +
      duration(remaining).replace(/ .*$/, '');

  return dur + '  ' + progress + '#[fg=0]';
};

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

