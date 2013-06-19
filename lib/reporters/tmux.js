var fs        = require('fs');
var path      = require('path');
var strRepeat = require('../../lib/helpers').strRepeat;
var duration  = require('../../lib/helpers').duration;
var qz        = require('../../lib/helpers').quantize;

/**
 * Tmux reporter.
 */

exports.extend = function(pomo, options) {
  var self = this;
  var fn = path.resolve((options.file || '').replace(/^~/, home()));

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

exports.dot = '⋅';
exports.peg = '◦';
exports.len = 8;
exports.color = { work: 4, snack: 2 };

/**
 * Returns the timer msg
 */

exports.get = function(mode, percent, elapsed, remaining) {
  var dot = exports.dot;
  var peg = exports.peg;
  var len = exports.len;
  var color = exports.color[mode];

  elapsed = qz(elapsed);
  remaining = qz(remaining);

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
      duration(remaining).replace(/ .*$/, '') + '  ';

  return dur  + progress + '#[fg=0]';
};

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

