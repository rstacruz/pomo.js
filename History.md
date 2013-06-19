## v1.1.1 - unreleased

 * Fix typo in `--help` where it read "secs" instead of "mins"
 * Fix bug where the Tmux status doesn't clear on exit sometimes
 * The '3, 2, 1' countdown is now not being growled.

## v1.1.0 - June 20, 2013

 * Big refactor!
 * Refactored to allow custom reporters in the future
 * Linux speech support (uses espeak instead of say)
 * Growl support for other platforms (uses [growl] package)

## v1.0.7 - June 19, 2013

 * Update log format to show duration (eg, `6:55am - 7:25am`)

## v1.0.6 - June 18, 2013

 * Logging via `pomojs -l <file>`.

## v1.0.5 - June 18, 2013

 * Tmux integration with `pomojs -t`.

## v1.0.4 - June 18, 2013

 * Add `pomojs -d <mins>` for no-break timers.
 * Fix 'a minute to go!' announcement.
 * The progress bar and speaking is now better synchronizedk

## v1.0.3 - June 18, 2013

 * Fix progress bar clearing unnecesarily.
 * Minor style tweaks.

## v1.0.2 - June 17, 2013

 * Initial release.

[growl]: https://npmjs.org/package/growl
