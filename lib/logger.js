var fs = require('fs');
var yaml = require('js-yaml');
var moment = require('moment');

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

var logger = module.exports = function(file, pomodoro) {
  var data = yaml.load(logger.read(file)) || {};

  var date = moment(pomodoro.date).format('YYYY-MM-DD dddd').toLowerCase();
  var time = moment(pomodoro.date).format('h:mma');

  var str = pomodoro.reason;

  if (!data[date]) data[date] = {};
  data[date][time] = str;

  var output = yaml.safeDump(data);
  logger.write(file, output);

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
