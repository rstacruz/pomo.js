var Moment = require('moment');
var chai   = require('chai');
var sinon  = require('sinon');
var Q      = require('q');
var assert = chai.assert;

Q.longStackSupport = true;

var Timer   = require('../lib/timer');
var minutes = 6e4;

/* Promise helper */
global.pt = function(fn) {
  return function(done) {
    var promise = fn.apply(this);
    if (!promise.then) return done(new Error("Object "+promise+" is not a promise"));

    promise.then(
      function(data) { done(undefined, data); },
      function(err) { done(err); });
  };
};

describe('Timer', function() {
  var timer;
  var say;

  beforeEach(function() {
    say = sinon.spy();
  });

  beforeEach(function() {
    timer = new Timer(10, { say: function() {}, landing: {} });
  });

  afterEach(function() {
    timer.now.restore();
  });

  it('.elapsed', pt(function() {
    return Q['try'](function() {
      setTime('May 5 2013 03:00');
      return timer.start();

    }).then(0, 0, function() {
      setTime('May 5 2013 03:02');
      assert.equal(timer.elapsed(), 2 * minutes);

      setTime('May 5 2013 04:00');
    });
  }));

  // ----

  function setTime(date) {
    if (timer.now.restore) timer.now.restore();
    sinon.stub(timer, 'now', function() {
      return Moment(date).toDate();
    });
  }
});
