var moment   = require('moment');
var duration = require('./helpers').duration;
var Q        = require('q');

/**
 * Timer.
 *
 *     t = new Timer(30);
 *     t.start().then(...);
 *
 * Options:
 *
 *  * progress - progress callback.
 *  * say - the growl/speak callback.
 *
 */

var Timer = module.exports = function(mins, options) {
  if (!options) options = {};

  this.say = options.say || function(){};
  this.color = options.color || 34;
  this.duration = moment.duration(mins * 60000);
  this.speed = options.speed || 100;
  this.startDate = options.startDate || null;
  this.progress = options.progress || function(){};
  this.offset = options.offset || 0;
};

/**
 * Return elapsed time in ms.
 */

Timer.prototype.elapsed = function() {
  return (+this.now() - this.startDate) || 0.0;
};

/**
 * Returns the current date/time.
 * (You can stub me for tests)
 */

Timer.prototype.now = function() {
  return new Date();
};

/**
 * Starts a timer.
 * 
 *     timer.start().then(function() { ... });
 */

Timer.prototype.start = function(callback) {
  var timer = this;

  return Q.promise(function(ok, fail, progress) {
    timer.startDate = new Date(+timer.now() - timer.offset);
    var n = 0;
    var speed = timer.speed;

    function run() {
      n = ((n + 1) % (1000 / speed));
      if (n === 0) timer.speakTime();
      timer.update();

      if (timer.isLapsed()) {
        timer.done();
        ok();
      }
      else {
        progress(timer.elapsed());
        setTimeout(run, speed);
      }
    }

    run();
  });
};

/**
 * True if timer is done
 */

Timer.prototype.isLapsed = function() {
  return +this.elapsed() > this.duration;
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
  return +this.duration - this.elapsed();
};

/**
 * Speak the remaining time
 * ("2 minutes remaining")
 */

Timer.prototype.speakTime = function() {
  var lapsed    = moment.duration(this.elapsed() + 999);
  var remaining = moment.duration(this.remaining() + 999);
  var int = parseInt;

  if (int(lapsed.seconds()) === 0 && [5, 10, 15].indexOf(int(lapsed.asMinutes())) > -1) {
    this.say(int(lapsed.asMinutes()) + " minutes in!");

  } else if (int(lapsed.seconds()) === 0 && [5, 3, 2, 1].indexOf(int(remaining.asMinutes())) > -1) {
    this.say(lapsed.humanize() + " to go!");

  } else if (int(remaining.asSeconds()) === 15) {
    this.say("Last fifteen seconds");

  } else if (int(remaining.asSeconds()) <= 5 && int(remaining.asSeconds()) >= 1) {
    this.say(int(remaining.asSeconds()));
  }
};

/**
 * Display an update
 */

Timer.prototype.initial = function() {
  this.progress(0, 0, 0, this.color);
};

Timer.prototype.update = function() {
  this.progress(this.percent(), this.elapsed(), this.remaining(), this.color);
};

Timer.prototype.done = function() {
  this.update();
  this.progress(1);
};

