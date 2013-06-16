var moment = require('moment');
var _ = require('underscore');

function Timer(mins) {
  this.duration = mins * 60000;
  this.startDate = new Date();
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
  var dur = parseInt(this.elapsed() / 1000, 10);
  var remaining = parseInt(this.remaining() / 1000, 10);

  if (dur === 0) {
    var duration = moment.duration(remaining, 'seconds').humanize();
    var now = moment().format("H:m a");
    say("it's now " + now + ". let's do " + duration);
  } else if (dur === 60*5) {
    say("Five minutes in!");
  } else if (dur === 60*10) {
    say("Ten minutes in!");
  } else if (remaining === 60*3) {
    say("Three minutes to go!");
  } else if (remaining === 60*2) {
    say("Two minutes to go!");
  } else if (remaining === 60*1) {
    say("One minute to go!");
  } else if (remaining === 15) {
    say("Last fifteen seconds");
  } else if (remaining <= 5 && remaining > 0) {
    say(remaining);
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
    c(34, strRepeat(dot, len * perc)) +
    peg +
    c(34, strRepeat(dot, len * (1.0-perc)));

  process.stdout.write("\r   " + progress + '  ' + c(34, this.elapsedMsg()) + ' ')
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
  exec('say "'+words+'"');
}

function exec(cmd, callback) {
  var spawn = require('child_process').spawn;
  var proc = spawn('sh', ['-c', cmd].concat(cmd));
}


exports.say = say;
exports.Timer = Timer;
