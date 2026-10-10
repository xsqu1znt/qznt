import assert from "node:assert/strict";
import test from "node:test";

import { formatDuration, parseTime } from "../dist/index.js";

const SINCE = 1700000000000;

for (const [duration, expected] of [
    ["24h", "24 hours"],
    ["48h", "48 hours"],
    ["25h30m", "25 hours and 30 minutes"]
]) {
    test(`hms retains the full duration for ${duration}`, () => {
        assert.equal(formatDuration(SINCE + parseTime(duration), "hms", { since: SINCE }), expected);
    });
}

for (const [duration, expected] of [
    ["0s", "now"],
    ["1s", "1 second"],
    ["30m", "30 minutes"],
    ["1h30m", "1 hour and 30 minutes"],
    ["23h59m59s", "23 hours, 59 minutes and 59 seconds"]
]) {
    test(`hms preserves output below 24 hours for ${duration}`, () => {
        assert.equal(formatDuration(SINCE + parseTime(duration), "hms", { since: SINCE }), expected);
    });
}

for (const [duration, digital, ymdhms] of [
    ["24h", "1:00:00:00", "1 day"],
    ["48h", "2:00:00:00", "2 days"],
    ["25h30m", "1:01:30:00", "1 day, 1 hour and 30 minutes"]
]) {
    test(`digital and ymdhms preserve day output for ${duration}`, () => {
        const target = SINCE + parseTime(duration);
        assert.equal(formatDuration(target, "digital", { since: SINCE }), digital);
        assert.equal(formatDuration(target, "ymdhms", { since: SINCE }), ymdhms);
    });
}
