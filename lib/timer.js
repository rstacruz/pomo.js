var moment    = require('moment');
var strRepeat = require('./helpers').strRepeat;
var c         = require('./helpers').c;
var duration  = require('./helpers').duration;

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
  return this.elapsed() > this.duration;
};

/**
 * Elapsed percentage (0..1)
 */
Timer.prototype.percent = function() {
  return this.elapsed() * 1.0 / this.duration;
};

/**
 * Remaining time (ms)
 */
Timer.prototype.remaining = function() {
  return this.duration - this.elapsed();
};

/**
 * Elapsed msg (in English)
 * (`1m 3s`)
 */
Timer.prototype.elapsedMsg = function() {
  return duration(this.elapsed());
};

/** Speak the remaining
 */
Timer.prototype.speakTime = function() {
  var secs = parseInt(this.elapsed() / 1000, 10);
  var mins = secs / 60;
  var remaining = parseInt(this.remaining() / 1000, 10);
  var lastMins = remaining / 60;

  if (secs === 0) {
    var duration = moment.duration(remaining, 'seconds').humanize();
    var now = moment().format("H:mm a");
    this.say("it's now " + now + ". let's do " + duration);
  } else if ([5, 10, 15].indexOf(mins) > -1) {
    this.say(mins + " minutes in!");
  } else if ([5, 3, 2, 1].indexOf(lastMins) > -1) {
    this.say(lastMins + " minutes to go!");
  } else if (remaining === 15) {
    this.say("Last fifteen seconds");
  } else if (remaining < 5 && remaining >= 0) {
    this.say(remaining + 1);
  }
};

/** Display an update
 */
Timer.prototype.update = function() {
  var dot = '⋅';
  var peg = '✈';

  var len = 50;
  var perc = this.percent();
  var progress =
    c(this.color, strRepeat(dot, len * perc)) +
    peg +
    c(this.color, strRepeat(dot, len * (1.0-perc)));

  process.stdout.write("\r   " + progress + '  ' + c(this.color, this.elapsedMsg()) + ' ');
};

Timer.prototype.done = function() {
  process.stdout.write("\n");
};
