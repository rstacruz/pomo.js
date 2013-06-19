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
    logger.log('x.txt', {
      reason: 'working',
      duration: 35*mins, 'break': 5*mins,
      start: moment('May 5, 2013 1:00 pm').toDate(),
      end: moment('May 5, 2013 1:40 pm').toDate()
    });

    var args = logger.write.firstCall.args;

    assert.equal(args[0], 'x.txt');

    assert.jsonEqual(logger.load(args[1]), {
      '2013-05-05 sun': {
        '1:00pm - 1:40pm': 'working (35m + 5m)'
      }
    });
  });

  it('no break', function() {
    logger.log('x.txt', {
      reason: 'working',
      duration: 35*mins, 'break': 0,
      start: moment('May 5, 2013 1:00 pm').toDate(),
      end: moment('May 5, 2013 1:35 pm').toDate()
    });

    var args = logger.write.firstCall.args;
    assert.jsonEqual(logger.load(args[1]), {
      '2013-05-05 sun': {
        '1:00pm - 1:35pm': 'working (35m)'
      }
    });
  });

  it('should consolistart', function() {
    logger.log('x.txt', {
      reason: 'working',
      duration: 35*mins, 'break': 5*mins,
      start: moment('May 5, 2013 3:00 pm').toDate(),
      end: moment('May 5, 2013 3:40 pm').toDate()
    });
    logger.log('x.txt', {
      reason: 'working again',
      duration: 30*mins, 'break': 5*mins,
      start: moment('May 5, 2013 4:00 pm').toDate(),
      end: moment('May 5, 2013 4:35 pm').toDate(),
      interrupted: true
    });
    logger.log('x.txt', {
      reason: 'also working',
      duration: 25*mins, 'break': 5*mins,
      start: moment('May 6, 2013 5:00 am').toDate(),
      end: moment('May 6, 2013 5:30 am').toDate()
    });

    var args = logger.write.thirdCall.args;

    assert.jsonEqual(logger.load(args[1]), {
      '2013-05-05 sun': {
        '3:00pm - 3:40pm': 'working (35m + 5m)',
        '4:00pm - 4:35pm': 'working again (30m + 5m, stopped)'
      },
      '2013-05-06 mon': {
        '5:00am - 5:30am': 'also working (25m + 5m)'
      }
    });
  });
});
