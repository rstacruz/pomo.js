var c = require('./helpers').c;

exports.info = function() {
  process.stdout.write(c(33,' >  '));
  console.log.apply(this, arguments);
};

exports.line = function() {
  process.stdout.write('    ');
  console.log.apply(this, arguments);
};
