function Runner(work, snack) {
  this.work = work;
  this.snack = snack;
  this.events = new EventEmitter();
}

Runner.prototype.on = function() {
  this.events.apply(this.events, arguments);
};

Runner.prototype.run = function() {
  Q.try(function() {
    work  = new Timer(cli.work,  { mode: 'work',  say: say, progress: reporters });
    snack = new Timer(cli.snack, { mode: 'snack', say: say, progress: reporters });
  });
};

