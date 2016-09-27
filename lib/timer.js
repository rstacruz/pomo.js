var moment   = require('moment');
var duration = require('./helpers').duration;
var qz       = require('./helpers').quantize;
var Q        = require('q');
var _        = require('underscore');

/**
 * Timer. Creates a timer for `mins` minutes. Doesn't actually do anything
 * until you call `.start()`.
 *
 *     t = new Timer(30);
 *     t.start().then(...);
 *
 * Options:
 *
 *  * progress - progress callbacks.
 *  * say - the growl/speak callback.
 *
 * More options:
 *
 *  * speed - duration (in ms) in between progress updates
 *  * mode - 'snack' or 'work'
 *
 */

var Timer = module.exports = function(mins, options) {
  if (!options) options = {};

  this.progress = options.progress || function(){};
  this.mode = options.mode || 'work';
  this.speed = options.speed || 1000;
  this.duration = moment.duration(mins * 60000);
  this.startDate = null;
  this.minimalAnnouncements = !!options.minimalAnnouncements;
};

/**
 * Return elapsed time in ms.
 */

Timer.prototype.elapsed = function() {
  if (!this.startDate) return 0.0;
  return moment.duration(Math.min(+this.now() - this.startDate, this.duration)) || 0.0;
};

/**
 * Returns the current date/time.
 * (You can stub me for tests)
 */

Timer.prototype.now = function() {
  return new Date();
};

/**
 * Starts a timer, making periodic updates.
 *
 *     timer.start().then(function() { ... });
 */

Timer.prototype.start = function(callback) {
  var timer = this;

  return Q.promise(function(ok, fail, progress) {
    timer.startDate = timer.now();
    var n = 0;
    var speed = timer.speed;

    function run() {
      timer.update();

      if (timer.isLapsed()) {
        timer.done();
        ok();
      }
      else {
        progress(timer.elapsed());
        timer._id = setTimeout(run, speed);
      }
    }

    run();
  });
};

/**
 * True if timer is done
 */

Timer.prototype.isLapsed = function() {
  return +this.elapsed() >= this.duration;
};

/**
 * Elapsed percentage (0..1)
 */

Timer.prototype.percent = function() {
  return +this.elapsed() * 1.0 / +this.duration;
};

/**
 * Remaining time (ms)
 */

Timer.prototype.remaining = function() {
  return moment.duration(+this.duration - this.elapsed());
};

/**
 * Returns the message for the current second (to be spoken).
 */

Timer.prototype.getMessage = function() {
  var lapsed    = qz(this.elapsed());
  var remaining = qz(this.remaining());
  var int = parseInt;

  // If too early, don't say anything
  if (lapsed < 2000 || this.minimalAnnouncements)
    return;

  // "5 minutes in!"
  if (lapsed.seconds() === 0 && _([5, 10, 15]).include(lapsed.asMinutes()))
    return lapsed.asMinutes() + " minutes in!";

  // "3 minutes to go!"
  if (remaining.seconds() === 0 && _([5, 3, 2, 1]).include(remaining.asMinutes()))
    return remaining.humanize() + " to go!";

  // "last X seconds..."
  if (_([30, 15]).include(remaining.asSeconds()))
    return "Last " + remaining.asSeconds() + " seconds";

  // "5"... "4"... "3"...
  var secs = remaining.asSeconds();
  if (secs <= 5 && secs >= 1)
    return secs;
};

Timer.prototype.interrupt = function() {
  if (this._id) {
    clearTimeout(this._id);
    delete this._id;
  }
};

/**
 * Run progress meters
 */

Timer.prototype.progress = function() {
  var args = arguments;
  this.progress.forEach(function(callback) {
    callback.apply(null, args);
  });
};

/**
 * Display an update
 */

Timer.prototype.initial = function() {
  this.progress(this.mode, 0, 0, 0);
};

Timer.prototype.update = function() {
  if (this.percent() < 1)
    this.progress(this.mode, this.percent(), this.elapsed(), this.remaining(), this.getMessage());
};

Timer.prototype.done = function() {
  this.progress(this.mode, 1, this.duration, 0);
};
