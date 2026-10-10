# Changelog

## 2.2.1

- Fixed `formatDuration(target, "hms")` dropping whole days. HMS now uses total hours: `24h` becomes `"24 hours"`, `48h` becomes `"48 hours"`, and `25h30m` becomes `"25 hours and 30 minutes"`. HMS output below 24 hours and the `"digital"` and `"ymdhms"` styles are unchanged.
