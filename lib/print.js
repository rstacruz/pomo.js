var c      = require('./helpers').c;
var moment = require('moment');

exports.info = function(msg) {
  process.stdout.write(c(33,' >  '));
  console.log(msg.replace(/\n/g, '\n    '));
};

exports.now = function(msg) {
  var dot = ' ⋅ ';

  console.log('');
  exports.info(moment().format('HH:mma') + dot + msg);
  console.log('');
};
