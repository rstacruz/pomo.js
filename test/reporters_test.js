require('./setup');

var Landing  = require('../lib/reporters/landing');
var Tmux     = require('../lib/reporters/tmux');
var Logger   = require('../lib/reporters/logger');
var Speaker  = require('../lib/reporters/speaker');
var Runner   = require('../lib/runner');
var EventEmitter = require('events').EventEmitter;
var Helpers  = require('../lib/helpers');

var _ = require('underscore');
var fs = require('fs');
var Q = require('q');

describe('Simulations', function() {
  var pomo = {};
  var events;

  // Stub `pomo`
  beforeEach(function() {
    pomo = new Runner(25, 5, { reason: 'torture' });
    events = pomo.events;

    sinon.stub(pomo, 'now', function() {
      return moment('jan 1 2013 03:00 am');
    });
  });

  /**
   * Test the tmux reporter
   */

  describe('tmux', function() {
    var file;

    beforeEach(function() {
      Tmux.dot = '.';
      Tmux.peg = 'X';
      Tmux.color = { work: 2, snack: 4 };

      file = '/tmp/pomo_simulation_test_'+Math.random();
      Tmux.extend(pomo, { file: file });
    });

    it('initial', pt(function(done) {
      return Q['try'](function() {

        events.emit('start');
        events.emit('timer', 'work', 0, 0, 10000, null);
        return Q.delay(50);

      }).then(function() {
        assert.equal(read(file), '#[fg=0]#[fg=2]X#[fg=0]........#[fg=0]');
      });
    }));

    it('progress', pt(function() {
      return Q['try'](function() {

        events.emit('timer', 'work', 0.4, 4000, 10000, null);
        return Q.delay(50);

      }).then(function() {
        assert.equal(read(file), '#[fg=2]10s  #[fg=0]...#[fg=2]X#[fg=0].....#[fg=0]');
      });
    }));
  });

  /**
   * Test the Speak reporter
   */

  describe('speaker', function() {
    var speak, growl;

    beforeEach(function() {
      speak = sinon.stub(Speaker, 'speak');
      growl = sinon.stub(Speaker, 'growl');

      Speaker.extend(pomo, { quiet: false });
    });

    afterEach(function() {
      Speaker.speak.restore();
      Speaker.growl.restore();
    });

    it('initial', function() {
      events.emit('start');
      events.emit('timer', 'work', 0, 0, 10000, null);

      assert.isTrue(speak.calledOnce);
      assert.jsonEqual(speak.firstCall.args, ["3:00 am, 25 minutes for torture"]);
    });

    it('5 minutes in', function() {
      events.emit('timer', 'work', 0.2, 5*minutes, 25*minutes, '5 minutes in');

      assert.isTrue(speak.calledOnce);
      assert.jsonEqual(speak.firstCall.args, ["5 minutes in"]);
    });
    it('done', function() {
      events.emit('snack');

      assert(Speaker.speak.calledOnce);
    });
  });

});

function read(file) {
  return fs.readFileSync(file, 'utf-8');
}
