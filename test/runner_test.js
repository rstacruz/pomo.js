require('./setup');
if (process.env['fast']) return;

var Runner = require('../lib/runner');
var secs = 1000;

describe('Runner', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  this.timeout(30*secs);

  it('should work', function(done) {
    var runner = new Runner(5 / 60, 5 / 60, { reason: "Tea" });
    var events = [];

    runner.on({
      'start': function() {
        process.stdout.write(':');
        events.push(['start', v(arguments)]);
      },

      'timer': function(mode, perc, elapsed, remaining, words) {
        events.push(['timer', [ mode, r(perc, 0.1), r(elapsed, 500), r(remaining, 500), words ] ]);
        process.nextTick(function() { clock.tick(1001); });
      },

      'snack': function() {
        events.push(['snack', v(arguments)]);
        process.nextTick(function() { clock.tick(3001); });
      },

      'finish': function() {
        process.stdout.write(':');
        events.push(['finish', v(arguments)]);

        assert.jsonEqual(events, [
          [ 'start', [] ],
          //           mode    perc  ela  rem    words
          [ 'timer', [ 'work',  0,   0,   0,     null ] ],
          [ 'timer', [ 'work',  0,   0,    5000, null ] ],
          [ 'timer', [ 'work',  0.2, 1000, 4000, null ] ],
          [ 'timer', [ 'work',  0.4, 2000, 3000, 3 ] ],
          [ 'timer', [ 'work',  0.6, 3000, 2000, 2 ] ],
          [ 'timer', [ 'work',  0.8, 4000, 1000, 1 ] ],
          [ 'timer', [ 'work',  1.0, 5000, 0,    null ] ],
          [ 'snack', [] ],
          //           mode    perc  ela  rem    words
          [ 'timer', [ 'snack', 0,   0,   0,     null ] ],
          [ 'timer', [ 'snack', 0,   0,    5000, null ] ],
          [ 'timer', [ 'snack', 0.2, 1000, 4000, null ] ],
          [ 'timer', [ 'snack', 0.4, 2000, 3000, 3 ] ],
          [ 'timer', [ 'snack', 0.6, 3000, 2000, 2 ] ],
          [ 'timer', [ 'snack', 0.8, 4000, 1000, 1 ] ],
          [ 'timer', [ 'snack', 1.0, 5000, 0,    null ] ],
          [ 'finish', [] ]
        ]);

        done();
      }
    });

    runner.run();
  });
});

// "normalizes" an arguments object
function v(args) {
  return [].slice.call(args).map(function(item) {
    return (item && item.valueOf) ? item.valueOf() : item;
  });
}

// Round
function r(number, precision) {
  return Math.round(1000 * precision * Math.round(number / precision)) / 1000;
}
