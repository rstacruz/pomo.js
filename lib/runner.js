var EventEmitter = require('events').EventEmitter;
var moment       = require('moment');
var Q            = require('q');
var _            = require('underscore');
var Timer        = require('./timer');

/**
 * Manages a work and snack timer and emits events along the way.
 *
 * Events:
 *  - start
 *  - timer (mode, perc, elapsed, remaining, words) - fired on update/start/finish
 *  - finish
 *  - interrupt
 *
 * The timer event can be fired with:
 *
 *  - Initial printout ('work', 0, 0, 0)
 *  - Progress ('work', 0.5, 2000, 4000, null)
 *  - Progress ('work', 0.5, 2000, 4000, "last 2 seconds")
 *  - Done ('work', 1, ...)
 *  - Interrupt (null)
 *
 * Example:
 *
 *     var runner = new Runner(25, 5);
 *     runner
 *       .on('start', function() { ... })
 *       .on('work:start', function() { ... })
 *       .run();
 */

var Runner = module.exports = function(work, snack, options) {
  // Timers
  this.work        = new Timer(work, {mode: 'work'});
  this.snack       = snack ? new Timer(snack, {mode: 'snack'}) : null;
  // Start and end times
  this.start       = null;
  this.end         = null;
  this.interrupted = false;
  // Misc
  this.reason      = options.reason;
  this.events      = new EventEmitter();
};

/**
 * Executes the test trunner.
 */

Runner.prototype.run = function() {
  var self = this;
  var events = self.events;

  process.on('SIGINT', function() {
    self.interrupted = true;
    events.emit("interrupt");
    events.emit("timer", null);
    process.exit(0);
  });

  return Q['try'](function() { /* Work: initial */
    self.work.progress =
    self.snack.progress = function(a, b, c, d, e) {
      events.emit('timer', a, b, c, d, e);
    };

    events.emit('start');
    self.work.initial();

    self.start = self.now();
    self.interrupted = false;

    return Q.delay(1000);

  }).then(function() { /* Work: start */
    return self.work.start();

  }).then(function() { /* Snack */

    if (!self.snack) return;

    return Q['try'](function() { /* Snack: initial */
      events.emit('snack');
      self.snack.initial();

      return Q.delay(3000);

    }).then(function() { /* Snack: start */
      self.end = self.now();
      return self.snack.start();
    });

  }).then(function() { /* Everything finish */
    events.emit('finish');

  }).done();
};

/**
 * Returns the current date.
 * (Here to be stubbable)
 */

Runner.prototype.now = function() {
  return moment(this.work.now());
};

/**
 * Interrupts the current run.
 */

Runner.prototype.interrupt = function() {
  this.events.emit('interrupt');
  return this;
};

/**
 * Binds to an event.
 */
Runner.prototype.on = function(event, fn) {
  if (typeof event === 'object') {
    var self = this;
    _.each(event, function(listener, e) {
      self.on(e, listener);
    });

    return this;
  }

  this.events.on(event, _(fn).bind(this));
  return this;
};

module.exports = Runner;
