require('./setup');
describe('misc', function() {
  it('should require files fine', function() {
    require('../lib/speak');
    require('../lib/helpers');
    require('../lib/timer');
    require('../lib/runner');
    require('../lib/reporters/tmux');
    require('../lib/reporters/speaker');
    require('../lib/reporters/landing');
    require('../lib/reporters/logger');
  });
});
