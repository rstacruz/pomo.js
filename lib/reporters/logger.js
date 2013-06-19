var fs       = require('fs');
var ini      = require('ini');
var moment   = require('moment');
var format   = require('util').format;
var duration = require('../../lib/helpers').shortDuration;

/**
 * Logs the given `pomodoro` to `file`.
 *
 *   pomodoro == {
 *     reason: 'xx'
 *     duration: 30000
 *     break: 5000
 *     date: 
 *     interrupted: false
 *   }
 */

exports.extend = function(pomo, logfile) {
  var self = this;

  pomo.on('interrupt finish', function() {
    if (!pomo.work.startDate) return;

    self.log(logfile, {
      reason      : pomo.reason,
      start       : pomo.start,
      end         : pomo.end || pomo.now(),
      duration    : pomo.work.elapsed(),
      'break'     : pomo.snack.elapsed(),
      interrupted : pomo.interrupted
    });
  });
};

exports.log = function(file, pomodoro) {
  var data = this.load(this.read(file)) || {};

  // Heading
  var date = moment(pomodoro.start).format('YYYY-MM-DD ddd').toLowerCase();

  // Key
  var time = format("%s - %s",
    moment(pomodoro.start).format('h:mma'),
    moment(pomodoro.end).format('h:mma'));

  var str = format("%s (%s%s%s)",
    pomodoro.reason,
    duration(pomodoro.duration),
    (pomodoro['break'] ? (' + ' + duration(pomodoro['break'])) : ''),
    (pomodoro.interrupted ? ', stopped' : ''));

  if (!data[date]) data[date] = {};
  data[date][time] = str;

  var output = this.dump(data);
  this.write(file, output);

};

/**
 * Dump/load from object to/from sting
 * @api internal
 */

exports.dump = function(obj) {
  return ini.stringify(obj);
};

exports.load = function(str) {
  return ini.parse(str);
};

/**
 * Reads file
 * @api internal
 */

exports.read = function(file) {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch(e) {
    return '';
  }
};

exports.write = function(file, output) {
  fs.writeFileSync(file, output, { encoding: 'utf-8' });
};
