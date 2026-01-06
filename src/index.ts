import * as arrayUtils from "./arr";
import * as asyncUtils from "./async";
import * as functionUtils from "./fn";
import * as dateUtils from "./date";
import * as formatUtils from "./format";
import * as isUtils from "./is";
import * as mathUtils from "./math";
import * as numberUtils from "./num";
import * as objectUtils from "./obj";
import * as randomUtils from "./rnd";
import * as stringUtils from "./str";
import * as timingUtils from "./timing";
import * as toUtils from "./to";
import { Pipe } from "./Pipe";
import { Storage } from "./Storage";
import { Cache } from "./Cache";
import { Loop } from "./Loop";

export const $ = {
    ...arrayUtils,
    ...asyncUtils,
    ...functionUtils,
    ...dateUtils,
    ...formatUtils,
    ...isUtils,
    ...mathUtils,
    ...numberUtils,
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

export * from "./arr";
export * from "./async";
export * from "./fn";
export * from "./date";
export * from "./format";
export * from "./is";
export * from "./math";
export * from "./num";
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
