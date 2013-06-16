var moment = require('moment');
var _ = require('underscore');
var growl = require('growl');

function Timer(mins, options) {
  if (!options) options = {};
  this.duration = mins * 60000;
  this.startDate = new Date();
  this.color = options.color || 34;
}

/** Return elapsed time in ms.
 */
Timer.prototype.elapsed = function() {
  return (+new Date() - this.startDate);
};

Timer.prototype.start = function(callback) {
  var timer = this;
  function run() {
    timer.update();
    timer.say();

    if (timer.isLapsed()) {
      timer.done();
      callback();
    }
    else { setTimeout(run, 1000); }
  }

  run();
};

Timer.prototype.isLapsed = function() {
  return this.elapsed() > this.duration;
};

Timer.prototype.percent = function() {
  return this.elapsed() * 1.0 / this.duration;
};

Timer.prototype.remaining = function() {
  return this.duration - this.elapsed();
};

Timer.prototype.elapsedMsg = function() {
  var d = moment.duration(this.elapsed());
  var segs = [];
  if (d.minutes() > 0) segs.push(d.minutes() + 'm');
  if (d.seconds() > 0) segs.push(d.seconds() + 's');

  return segs.join(" ") || '-';
};

/** Speak the remaining
 */
Timer.prototype.say = function() {
  var secs = parseInt(this.elapsed() / 1000, 10);
  var mins = secs / 60;
  var remaining = parseInt(this.remaining() / 1000, 10);
  var lastMins = remaining / 60;

  if (secs === 0) {
    var duration = moment.duration(remaining, 'seconds').humanize();
    var now = moment().format("H:mm a");
    say("it's now " + now + ". let's do " + duration);
  } else if ([5, 10, 15].indexOf(mins) > -1) {
    say(mins + " minutes in!");
  } else if ([5, 3, 2, 1].indexOf(lastMins) > -1) {
    say(lastMins + " minutes to go!");
  } else if (remaining === 15) {
    say("Last fifteen seconds");
  } else if (remaining < 5 && remaining >= 0) {
    say(remaining + 1);
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

function strRepeat(str, n) {
  var re = '';
  _.times(parseInt(n, 10), function() { re += str; });
  return re;
}

Timer.prototype.done = function() {
  process.stdout.write("\n");
}

function c(n, str) {
  return '\033['+n+'m'+str+'\033[0m';
}

function say(words) {
  if (!global.cli.quiet) {
    exec('say "'+words+'"');
  }
  exec("echo " + JSON.stringify(words) + " | growlnotify Pomo");
}

function exec(cmd, callback) {
  var spawn = require('child_process').spawn;
  var proc = spawn('sh', ['-c', cmd].concat(cmd));
}

function clear() {
  process.stdout.write('\u001b[2J');
}

exports.c = c;
exports.say = say;
exports.clear = clear;
exports.Timer = Timer;
exports.exec = exec;
