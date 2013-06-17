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
    timer.startDate = timer.now();
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
 * Elapsed msg (in English)
 * (`1m 3s`)
 */

Timer.prototype.elapsedMsg = function() {
  return duration(this.elapsed());
};

/**
 * Speak the remaining time
 * ("2 minutes remaining")
 */

Timer.prototype.speakTime = function() {
  var lapsed    = moment.duration(this.elapsed());
  var remaining = moment.duration(this.remaining());

  if (lapsed.seconds() === 0 && [5, 10, 15].indexOf(lapsed.asMinutes()) > -1) {
    this.say(parseInt(lapsed.asMinutes(), 10) + " minutes in!");

  } else if (lapsed.seconds() === 0 && [5, 3, 2, 1].indexOf(remaining.asMinutes()) > -1) {
    this.say(lapsed.minutes() + " minutes to go!");

  } else if (lapsed.asSeconds() === 15) {
    this.say("Last fifteen seconds");

  } else if (remaining.asSeconds() <= 5 && remaining.asSeconds() >= 1) {
    this.say(parseInt(remaining.asSeconds(), 10));
  }
};

/**
 * Display an update
 */

Timer.prototype.initial = function() {
  this.progress(0, '-', this.color);
};

Timer.prototype.update = function() {
  this.progress(this.percent(), this.elapsedMsg(), this.color);
};

Timer.prototype.done = function() {
  this.progress(1);
};

