require('./setup');

var logger = require('../lib/logger');
var yaml = require('js-yaml');
var fs = require('fs');

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
      duration: 35000, 'break': 5000,
      date: moment('May 5, 2013 1:00 pm').toDate()
    });

    var args = logger.write.firstCall.args;

    assert.equal(args[0], 'x.txt');

    assert.jsonEqual(yaml.load(args[1]), {
      '2013-05-05 sunday': {
        '1:00pm': 'working'
      }
    });
  });

  it('should consolidate', function() {
    logger('x.txt', {
      reason: 'working',
      duration: 35000, 'break': 5000,
      date: moment('May 5, 2013 3:00 pm').toDate()
    });
    logger('x.txt', {
      reason: 'working again',
      duration: 35000, 'break': 5000,
      date: moment('May 5, 2013 3:30 pm').toDate()
    });
    logger('x.txt', {
      reason: 'also working',
      duration: 35000, 'break': 5000,
      date: moment('May 6, 2013 5:00 am').toDate()
    });

    var args = logger.write.thirdCall.args;

    assert.jsonEqual(yaml.load(args[1]), {
      '2013-05-05 sunday': {
        '3:00pm': 'working',
        '3:30pm': 'working again'
      },
      '2013-05-06 monday': {
        '5:00am': 'also working'
      }
    });
  });
});
