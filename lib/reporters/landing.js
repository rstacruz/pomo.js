var strRepeat = require('../../lib/helpers').strRepeat;
var duration  = require('../../lib/helpers').duration;
var qz        = require('../../lib/helpers').quantize;
var c         = require('../../lib/helpers').c;
var clear     = require('../../lib/helpers').clear;
var format    = require('util').format;
var moment    = require('moment');

/**
 * Landing strip reporter.
 */

exports.extend = function(pomo) {
  var self = this;

  pomo.on({
    'start': function() {
      var str = format("time for %s (%s)",
        pomo.reason, duration(pomo.work.duration));

      if (pomo.snack)
        str += format("\na %s break follows",
          duration(pomo.snack.duration));

      self.info(str);
    },

    // Work-to-snack transition
    'snack': function() {
      self.info(format("time for a break (%s)",
        duration(pomo.snack.duration)));
    },

    'timer': function(mode, perc, elapsed, remaining, words) {
      self.showStrip.apply(this, arguments);
    },

    // All done
    'finish': function() {
      self.info("done");
    },

    'interrupt': function() {
      console.log("");
      self.info("interrupted");
    }
  });
};

/**
 * Print the landing strip.
 * Method signature is same as runner.on('timer')
 */

exports.showStrip = function(mode, percent, elapsed, remaining) {
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

/**
 * Prints a line, used by .info
 */

exports.print = function(msg) {
  process.stdout.write(c(33,' >  '));
  console.log(msg.replace(/\n/g, '\n    '));
};

/**
 * Prints a line
 *
 *    .info('hello there')
 *    " > 03:34pm - hello there"
 */

exports.info = function(msg) {
  var dot = ' ⋅ ';

  console.log('');
  this.print(moment().format('HH:mma') + dot + msg);
  console.log('');
};
