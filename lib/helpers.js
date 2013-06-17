var _      = require('underscore');
var moment = require('moment');

exports.strRepeat = function(str, n) {
  n = parseInt(n, 10);
  if (n <= 0 || isNaN(n) || typeof n !== 'number') return '';

  var re = '';
  _(n).times(function() { re += str; });
  return re;
};

exports.c = function(n, str) {
  return '\033['+n+'m'+str+'\033[0m';
};

var exec = exports.exec = function(cmd, callback) {
  var spawn = require('child_process').spawn;
  var proc = spawn('sh', ['-c', cmd].concat(cmd));
};

exports.speak = function(words) {
  exec('say '+JSON.stringify(words));
};

exports.growl = function(words) {
  exec("echo " + JSON.stringify(words) + " | growlnotify Pomo");
};

exports.clear = function() {
  process.stdout.write('\u001b[2J');
};

/**
 * Miliseconds to duration words
 * (12000 => "12s")
 *
 * The +999 hack is there to make `duration(12001) == '13s'` rather than 12s
 */
exports.duration = function(n) {
  var d = moment.duration(+n + 999);
  var segs = [];
  if (d.minutes() > 0) segs.push(d.minutes() + 'm');
  if (d.seconds() > 0) segs.push(d.seconds() + 's');

  return segs.join(" ") || '0s';
};

exports.shortDuration = function(n, suffix) {
  return exports.duration(n).replace(/ .*$/, suffix || '');
};

/**
 * Copy to clipboard
 */
exports.copy = function(str) {
  exec("echo " + JSON.stringify(str) + " | pbcopy");
};

/**
 * Indents a string
 * indent("Hello", "  ");
 */
exports.indent = function(str, prefix) {
  return str.replace(/(^|\n)/g, function(n) { return n + prefix; });
};

/**
 * Quantizes a duration to the nearest second.
 */
exports.quantize = function(n) {
  return moment.duration(Math.round(n / 1000) * 1000);
};
