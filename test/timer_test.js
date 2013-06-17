require('./setup');

var Timer = require('../lib/timer');
var secs = 1000;
var mins = 60*secs;

describe('Timer', function() {

  var timer;
  var say;

  beforeEach(function() {
    say = sinon.spy();
  });

  it(".elapsed()", function() {
    timer = makeTimer({ mins: 1.1, elapsed: 6*secs });
    assert.equal(+timer.elapsed(), 6*secs);
  });

  it(".remaining()", function() {
    timer = makeTimer({ mins: 1.1, elapsed: 6*secs });
    assert.equal(+timer.remaining(), 60*secs);
  });

  it(".isLapsed() true", function() {
    timer = makeTimer({ mins: 1.1, elapsed: 1*mins + 7*secs });
    assert.equal(timer.isLapsed(), true);
  });

  it(".isLapsed() false", function() {
    timer = makeTimer({ mins: 1.1, elapsed: 1*mins + 5*secs });
    assert.equal(timer.isLapsed(), false);
  });


  /**
   * Percent
   */

  describe('percent()', function() {
    it("at 0", function() {
      timer = makeTimer({ mins: 3, elapsed: 0 });
      assert.equal(+timer.percent(), 0);
    });

    it("at 0.5", function() {
      timer = makeTimer({ mins: 10, elapsed: 5*mins });
      assert.equal(+timer.percent(), 0.5);
    });

    it("at 1.0", function() {
      timer = makeTimer({ mins: 10, elapsed: 10*mins });
      assert.equal(+timer.percent(), 1.0);
    });
  });

  /**
   * Test what happens when we're off by a few milliseconds
   */

  describe('quantization', function() {
    it("-0.1", function() {
      timer = makeTimer({ mins: 1.1, elapsed: 5.9*secs });

      assert.match(timer.getMessage(), /a minute to go/);
    });

    it("+0.1", function() {
      timer = makeTimer({ mins: 1.1, elapsed: 6.1*secs });

      assert.match(timer.getMessage(), /a minute to go/);
    });
  });

  /**
   * Messages for speaking
   */

  describe('getMessage()', function() {
    it("don't say when too early", function() {
      timer = makeTimer({ mins: 1, elapsed: 0 });

      assert.isUndefined(timer.getMessage());
    });

    it("1 minute to go", function() {
      timer = makeTimer({ mins: 1.1, elapsed: 6*secs });

      assert.match(timer.getMessage(), /a minute to go/);
    });

    it("2 minutes to go", function() {
      timer = makeTimer({ mins: 2.1, elapsed: 6*secs });

      assert.match(timer.getMessage(), /2 minutes to go/);
    });

    it("last 15 secs", function() {
      timer = makeTimer({ mins: 1, elapsed: 45*secs });

      assert.match(timer.getMessage(), /Last 15/);
    });

    it("last 5 secs", function() {
      timer = makeTimer({ mins: 1, elapsed: 55*secs });

      assert.match(timer.getMessage(), /5/);
    });
  });

  describe('speakTime()', function() {
    it("say '2 minutes to go'", function() {
      timer = makeTimer({ mins: 2.1, elapsed: 6*secs });
      timer.speakTime();

      assert.equal(say.callCount, 1);
      assert.match(say.firstCall.args[0], /2 minutes to go/);
    });
  });

  /**
   * Create a mock timer object
   */

  function makeTimer(options) {
    var timer = new Timer(options.mins);
    var start = moment('jan 10 2011, 01:00 am').toDate();

    timer.startDate = start;

    // Stub the now() to simulate a given elapsed time
    timer.now = function() { return moment(+start + options.elapsed).toDate(); };
    timer.say = say;

    return timer;
  }

});
