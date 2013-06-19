var fs = require('fs');
var ini = require('ini');
var moment = require('moment');
var duration = require('../lib/helpers').shortDuration;
var format = require('util').format;

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

var logger = module.exports = function(pomo, logfile) {
  pomo.on('interrupt finish', function() {
    if (!pomo.work.startDate) return;

    logger.log(logfile, {
      reason      : pomo.reason,
      start       : pomo.start,
      end         : pomo.end || pomo.now(),
      duration    : pomo.work.elapsed(),
      'break'     : pomo.snack.elapsed(),
      interrupted : pomo.interrupted
    });
  });
};

logger.log = function(file, pomodoro) {
  var data = logger.load(logger.read(file)) || {};

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

  var output = logger.dump(data);
  logger.write(file, output);

};

/**
 * Dump/load from object to/from sting
 * @api internal
 */

logger.dump = function(obj) {
  return ini.stringify(obj);
};

logger.load = function(str) {
  return ini.parse(str);
};

/**
 * Reads file
 * @api internal
 */

logger.read = function(file) {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch(e) {
    return '';
  }
};

logger.write = function(file, output) {
  fs.writeFileSync(file, output, { encoding: 'utf-8' });
};
