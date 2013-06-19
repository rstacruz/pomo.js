var Helpers = require('../../lib/helpers');
var speak   = require('../../lib/speak');
var moment  = require('moment');
var format  = require('util').format;

/**
 * Reporter for speaking and growling.
 */

exports.extend = function(pomo, options) {
  var self = this;

  var say = function(words) {
    if (!options.quiet) self.speak(words);

    // Don't growl the '3, 2, 1' part
    if (typeof words === 'string') self.growl(words);
  };

  pomo.on({
    'start': function() {
      say(format("%s, %s for %s",
         moment(pomo.now()).format("h:mm a"),
         pomo.work.duration.humanize(),
         pomo.reason));
    },
    'snack': function() {
      say(format("Done! %s, break for %s",
        moment().format("hh:mm a"),
        pomo.snack.duration.humanize()));
    },
    'finish': function() {
      say(pomo.reason + ": all done!");
    },
    'timer': function(_, _, _, _, words) {
      if (words) say(words);
    }
  });
};

exports.speak = speak;

exports.growl = function(msg) {
  var fruit = require.resolve('../../data/tomato.png');
  require('growl')(msg, { title: 'Pomo', image: fruit });
};

