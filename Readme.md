# Pomo.js

```
$ npm install -g pomo
$ pomojs --help
```

![Screenshot](http://rstacruz.github.io/pomo.js/screenshot.png)

[![Build Status](https://travis-ci.org/rstacruz/pomo.js.png?branch=master)](https://travis-ci.org/rstacruz/pomo.js)

### Get started

``` sh
$ pomojs                              # Start a timer
$ pomojs "Conquer the world"          # Reason (great if you're logging)
$ pomojs -w 30                        # --work for 30 minutes
$ pomojs -b 12                        # --break for 12 minutes
$ pomojs --help
```

### Features

 * Ridiculously simple (just type `pomojs`)
 * Configurable work and break durations (`pomojs --work 10 --break 2`)
 * Announces via text-to-speech ("5 minutes to go!")
 * Growls (via growlnotify)
 * No support for long breaks (this is a feature. problem?)
 * Tmux support (status bar integration)
 * Optional logging

### Requirements

 * node.js and OSX
 * growlnotify

### Tmux integration

Just add this to `~.tmux.conf`: (works almost exactly like in [pomo.rb][pomo-tmux])

     set-option -g status-right '#(cat ~/.pomo_stat)'

...then invoke it with `pomojs -t`.

### Logging

Invoke it with `pomojs -l ~/.pomo.log` to log any pomodoros. Log file looks like 
this:

``` ini
[2013-06-17 mon]
6:14am = work on things (25m + 5m)
7:05am = do great stuff (25m + 2m, stopped)

[2013-06-18 tue]
6:14am = eat pizza (25m + 5m)
```

### Saving your settings

Add this to your shell config, so that the next time you can invoke `pomo` with 
preset settings:

```
# ~/.bash_profile
alias pomo="pomojs --log ~/.pomo.log --tmux"
```

Even add more presets:

``` sh
# long-break pomodoro
alias longpomo="pomo -b 20"

# 10-minute pomodoro
alias minipomo="pomo -w 10"
```

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
