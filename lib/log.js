var c      = require('./helpers').c;
var moment = require('moment');

exports.info = function() {
  process.stdout.write(c(33,' >  '));
  console.log.apply(this, arguments);
};

exports.line = function() {
  process.stdout.write('    ');
  console.log.apply(this, arguments);
};

exports.now = function(msg) {
  var dot = ' ⋅ ';

  exports.line('');
  exports.info(moment().format('HH:mma') + dot + msg);
};
