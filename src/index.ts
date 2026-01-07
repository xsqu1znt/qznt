import * as arrayUtils from "./arr";
import * as asyncUtils from "./async";
import * as functionUtils from "./fn";
import * as dateUtils from "./date";
import * as formatUtils from "./format";
import * as fileUtils from "./fs";
import * as isUtils from "./is";
import * as mathUtils from "./math";
import * as objectUtils from "./obj";
import * as randomUtils from "./rnd";
import * as stringUtils from "./str";
import * as timingUtils from "./timing";
import * as toUtils from "./to";
import { Pipe } from "./Pipe";
import { Storage } from "./Storage";
import { Cache } from "./Cache";
import { Loop } from "./Loop";

const qznt = {
    ...arrayUtils,
    ...asyncUtils,
    ...functionUtils,
    ...dateUtils,
    ...formatUtils,
    ...fileUtils,
    ...isUtils,
    ...mathUtils,
    ...objectUtils,
    ...timingUtils,
    ...randomUtils,
    ...stringUtils,
    ...toUtils,
    Pipe,
    Storage,
    Cache,
    Loop
};

export const $ = qznt;
export default qznt;

export * from "./arr";
export * from "./async";
export * from "./fn";
export * from "./date";
export * from "./format";
export * from "./fs";
export * from "./is";
export * from "./math";
export * from "./obj";
export * from "./rnd";
export * from "./str";
export * from "./timing";
export * from "./to";
export * from "./types";
export { Pipe } from "./Pipe";
export { Storage } from "./Storage";
export { Cache } from "./Cache";
export { Loop } from "./Loop";
