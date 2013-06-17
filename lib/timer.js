var moment   = require('moment');
var duration = require('./helpers').duration;
var Landing  = require('./landing');
var Q        = require('q');

/**
 * Timer.
 *
 *     new Timer();
 */

var Timer = module.exports = function(mins, options) {
  if (!options) options = {};

  this.say = options.say || function(){};
  this.color = options.color || 34;
  this.duration = moment.duration(mins * 60000);
  this.startDate = null;
};

/**
 * Return elapsed time in ms.
 */

Timer.prototype.elapsed = function() {
  return (+new Date() - this.startDate) || 0.0;
};

/**
 * Starts a timer.
 * 
 *     timer.start().then(function() { ... });
 */

Timer.prototype.start = function(callback) {
  var timer = this;

  return Q.promise(function(ok, fail) {
    timer.startDate = new Date();
    var n = 0;

    function run() {
      n = ((n + 1) % 10);
      if (n === 0) timer.speakTime();
      timer.update();

      if (timer.isLapsed()) {
        timer.done();
        ok();
      }
      else { setTimeout(run, 100); }
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
  Landing.progress(0, '-', this.color);
};

Timer.prototype.update = function() {
  Landing.progress(this.percent(), this.elapsedMsg(), this.color);
};

Timer.prototype.done = function() {
  Landing.done();
};

