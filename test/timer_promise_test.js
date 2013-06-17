require('./setup');

var Timer = require('../lib/timer');

describe('Timer promises', function() {
  var timer;
  var say;

  beforeEach(function() {
    timer = new Timer(10, { speed: 100 });
  });

  afterEach(function() {
    timer.now.restore();
  });

  it('.elapsed', pt(function() {
    return Q.try(function() {
      setTime('May 5 2013 03:00');
      return timer.start();

    }).then(0, 0, function() {
      setTime('May 5 2013 03:02');
      assert.equal(timer.elapsed(), 2 * minutes);

      setTime('May 5 2013 04:00');
    });
  }));

  it('.isLapsed', pt(function() {
    return Q.try(function() {
      setTime('May 5 2013 03:00');
      return timer.start();

    }).then(0, 0, function() {
      assert.equal(timer.isLapsed(), false);

      setTime('May 5 2013 04:00');
      assert.equal(timer.isLapsed(), true);
    });
  }));

  /**
   * Move in time by stubbing timer.now
   */

  function setTime(date) {
    if (timer.now.restore) timer.now.restore();
    sinon.stub(timer, 'now', function() {
      return moment(date).toDate();
    });
  }
});
