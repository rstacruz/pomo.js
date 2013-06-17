# Pomo.js

```
$ npm install -g pomo
$ pomojs --help
```

![Screenshot](http://rstacruz.github.io/pomo.js/screenshot.png)

[![Build Status](https://travis-ci.org/rstacruz/pomo.js.png?branch=master)](https://travis-ci.org/rstacruz/pomo.js)

### Features

 * Command-line goodness (just type `pomojs`)
 * Configurable work and break durations (`pomojs --work 10 --break 2`)
 * Announces via text-to-speech ("5 minutes to go!")
 * Growls (via growlnotify)
 * No support for long breaks (this is a feature. problem?)
 * Tmux support (status bar integration)

### Requirements

 * node.js and OSX
 * growlnotify

### Tmux integration

Just add this to `~.tmux.conf`: (works almost exactly like in [pomo.rb][pomo-tmux])

     set-option -g status-right '#(cat ~/.pomo_stat)'

...then invoke it with `pomojs -t`.

### Also see

 * [visionmedia/pomo] - pomodoro task manager (ruby gem)
 * [pmd] - has OSX status bar integration
 * [pom] - shell script

### Acknowledgements

MIT

[visionmedia/pomo]: https://github.com/visionmedia/pomo
[pmd]: http://me.dt.in.th/page/pmd
[pom]: https://github.com/tobym/pom
[pomo-tmux]: https://github.com/visionmedia/pomo#tmux-status-bar-integration
