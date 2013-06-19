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
 *  - timer:initial  (mode)
 *  - timer:start (mode)
 *  - timer:update (mode, perc, elapsed, remaining)
 *  - timer:speak (mode, words)
 *  - timer:finish (mode, elapsed)
 *  - finish
 *
 *  - interrupt
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
  this.work        = new Timer(work, {mode: 'work'});
  this.snack       = snack ? new Timer(snack, {mode: 'break'}) : null;
  this.reason      = options.reason;
  this.stats       = { start: null, end: null, interrupted: false, reason: this.reason };
  this.events      = new EventEmitter();
  this.interrupted = false;
  this.start       = null;
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
    process.exit(0);
  });

  return Q['try'](function() { /* Work: initial */

    self.work.say = function(words) {
      events.emit('timer:speak', 'work', words);
    };
    self.snack.say = function(words) {
      events.emit('timer:speak', 'snack', words);
    };
    self.work.progress = function(a,b,c,d) {
      events.emit('timer:update', 'work', a, b, c, d);
    };
    self.snack.progress = function(a,b,c,d) {
      events.emit('timer:update', 'snack', a, b, c, d);
    };

    events.emit('start');
    events.emit('timer:initial', 'work');

    self.start = self.now();
    self.interrupted = false;

    self.work.initial();
    return Q.delay(1000);

  }).then(function() { /* Work: start */

    events.emit('timer:start', 'work');

    return self.work.start();

  }).then(function() { /* Work: end */

    self.work.done();
    self.work.abort();
    events.emit('timer:finish', 'work', self.work.elapsed());

  }).then(function() { /* Snack */

    if (!self.snack) return;

    return Q['try'](function() { /* Snack: initial */
      events.emit('snack');
      events.emit('timer:initial', 'snack');
      self.snack.initial();

      return Q.delay(3000);

    }).then(function() { /* Snack: start */
      events.emit('timer:start', 'snack');

      self.stats.end = self.now();
      return self.snack.start();

    }).then(function() { /* Snack: end */
      events.emit('timer:finish', 'snack');
      self.snack.abort();
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
