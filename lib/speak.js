var which = require('../lib/helpers').which;
var exec  = require('../lib/helpers').exec;
var format = require('util').format;

var pkgs = {
  say: "say %s",
  espeak: "echo %s | espeak"
};

var sayCmd =
  which('say') ? pkgs.say :
  which('espeak') ? pkgs.espeak : null;

/**
 * Polyfill for speaking
 * Uses `say` on OSX and `espeak` on linux
 */

module.exports = function(words) {
  exec(format(sayCmd, JSON.stringify(words)));
};

