require('./setup');

var logger = require('../lib/logger');
var fs = require('fs');
var mins = 60 * 1000;

describe('logger', function() {
  var data;

  /**
   * Stub out actual FS writing/reading
   */

  beforeEach(function() {
    data = '';

    sinon.stub(logger, 'write', function(file, newdata) {
      data = newdata;
    });
    sinon.stub(logger, 'read', function(file) {
      return data;
    });
  });

  afterEach(function() {
    logger.read.restore();
    logger.write.restore();
  });

  /**
   * Test
   */

  it('should work fresh', function() {
    logger('x.txt', {
      reason: 'working',
      duration: 35*mins, 'break': 5*mins,
      date: moment('May 5, 2013 1:00 pm').toDate()
    });

    var args = logger.write.firstCall.args;

    assert.equal(args[0], 'x.txt');

    assert.jsonEqual(logger.load(args[1]), {
      '2013-05-05 sun': {
        '1:00pm': 'working (35m + 5m)'
      }
    });
  });

  it('should consolidate', function() {
    logger('x.txt', {
      reason: 'working',
      duration: 35*mins, 'break': 5*mins,
      date: moment('May 5, 2013 3:00 pm').toDate()
    });
    logger('x.txt', {
      reason: 'working again',
      duration: 30*mins, 'break': 5*mins,
      date: moment('May 5, 2013 3:30 pm').toDate(),
      interrupted: true
    });
    logger('x.txt', {
      reason: 'also working',
      duration: 25*mins, 'break': 5*mins,
      date: moment('May 6, 2013 5:00 am').toDate()
    });

    var args = logger.write.thirdCall.args;

    assert.jsonEqual(logger.load(args[1]), {
      '2013-05-05 sun': {
        '3:00pm': 'working (35m + 5m)',
        '3:30pm': 'working again (30m + 5m, stopped)'
      },
      '2013-05-06 mon': {
        '5:00am': 'also working (25m + 5m)'
      }
    });
  });
});
