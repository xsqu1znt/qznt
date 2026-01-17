import * as arr from "./arr";
import * as async from "./async";
import * as fn from "./fn";
import * as date from "./date";
import * as format from "./format";
import * as fs from "./fs";
import * as is from "./is";
import * as math from "./math";
import * as obj from "./obj";
import * as rnd from "./rnd";
import * as str from "./str";
import * as timing from "./timing";
import * as to from "./to";
import { Pipe } from "./Pipe";
import { Storage } from "./Storage";
import { Cache } from "./Cache";
import { Loop } from "./Loop";

const qznt = {
    arr,
    async,
    fn,
    date,
    format,
    fs,
    is,
    math,
    obj,
    timing,
    rnd,
    str,
    to,
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
