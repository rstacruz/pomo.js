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
 *  - exit (happens after finish or interrupt)
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
  this.work        = new Timer(work, {mode: 'work', minimalAnnouncements: options.minimalAnnouncements});
  this.snack       = snack > 0 ? new Timer(snack, {mode: 'snack', minimalAnnouncements: options.minimalAnnouncements}) : null;
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
    events.emit('interrupt');
    events.emit('timer', null);
    events.emit('exit');
    process.exit(0);
  });

  function progress(a, b, c, d, e) {
    events.emit('timer', a, b, c, d, e);
  }

  return Q['try'](function() { /* Work: initial */
    self.work.progress = progress;
    if (self.snack) self.snack.progress = progress;

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
    events.emit('exit');

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
  this.work.interrupt();
  this.snack.interrupt();
  return this;
};

/**
 * Binds to an event.
 */
Runner.prototype.on = function(event, fn) {
  var self = this;

  if (typeof event === 'object') {
    _.each(event, function(listener, e) {
      self.on(e, listener);
    });

    return this;
  }

  _.each(event.trim().split(' '), function(event) {
    self.events.on(event, _(fn).bind(this));
  });
  return this;
};

module.exports = Runner;
