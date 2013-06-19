var Helpers = require('../../lib/helpers');
var speak   = Helpers.speak;
var growl   = Helpers.growl;
var moment  = require('moment');
var format  = require('util').format;

/**
 * Reporter for speaking and growling.
 */

exports.extend = function(pomo, options) {
  var say = function(words) {
    if (!options.quiet) speak(words);
    growl(words);
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
}
