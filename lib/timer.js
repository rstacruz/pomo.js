var moment    = require('moment');
var duration  = require('./helpers').duration;
var Landing   = require('./landing');

/**
 * Timer.
 *
 *     new Timer();
 */

var Timer = module.exports = function(mins, options) {
  if (!options) options = {};

  this.say = options.say || function(){};
  this.color = options.color || 34;
  this.duration = mins * 60000;
  this.startDate = null;
};

/**
 * Return elapsed time in ms.
 */

Timer.prototype.elapsed = function() {
  return (+new Date() - this.startDate);
};

/**
 * Starts a timer.
 */

Timer.prototype.start = function(callback) {
  this.startDate = new Date();
  var timer = this;
  function run() {
    timer.update();
    timer.speakTime();

    if (timer.isLapsed()) {
      timer.done();
      callback();
    }
    else { setTimeout(run, 1000); }
  }

  run();
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

  if (+lapsed < 500) {
    var now = moment().format("H:mm a");
    this.say("it's now " + now + ". let's do " + remaining.humanize());

  } else if ([5, 10, 15].indexOf(lapsed.minutes()) > -1) {
    this.say(lapsed.minutes() + " minutes in!");

  } else if ([5, 3, 2, 1].indexOf(remaining.minutes()) > -1) {
    this.say(remaining.minutes() + " minutes to go!");

  } else if (remaining.seconds() === 15) {
    this.say("Last fifteen seconds");

  } else if (remaining.seconds() < 5 && remaining.seconds() >= 0) {
    this.say(remaining.seconds() + 1);
  }
};

/**
 * Display an update
 */

Timer.prototype.update = function() {
  Landing.progress(this.percent(), this.elapsedMsg(), this.color);
};

Timer.prototype.done = function() {
  Landing.done();
};

