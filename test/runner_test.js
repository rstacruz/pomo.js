require('./setup');

var Runner = require('../lib/runner');
var secs = 1000;

describe('Runner', function() {
  this.timeout(30*secs);

  it('should work', function(done) {
    var runner = new Runner(2 / 60, 2 / 60, { reason: "Tea" });
    runner
      .on('start', function() {
        console.log("Starting");

      }).on('work:start', function() {
        console.log("Work start");

      }).on('work:progress', function() {
        console.log("Work progress");

      }).on('work:finish', function() {
        console.log("Work complete");
        done();

      }).run();
  });
});
