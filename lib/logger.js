var fs = require('fs');
var yaml = require('js-yaml');
var moment = require('moment');

/**
 * pomodoro == {
 *   reason: 'xx'
 *   duration: 30000
 *   break: 5000
 *   date: 
 *   interrupted: false
 * }
 */

var logger = module.exports = function(file, pomodoro) {
  var data = logger.read(file) || {};

  var date = moment(pomodoro.date).format('YYYY/MM/DD dddd');
  var str = pomodoro.reason;

  if (!data[date]) data[date] = [];
  data[date].push(str);

  var output = yaml.safeDump(data);
  logger.write(file, output);

};

/**
 * Reads file
 * @api internal
 */

logger.read = function(file) {
  try {
    return require(file);
  } catch(e) {
    return {};
  }
};

logger.write = function(file, output) {
  fs.writeFile(file, output);
};
