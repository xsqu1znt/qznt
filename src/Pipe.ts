/**
 * Pipes a value through a series of functions.
 * Each function takes the output of the previous one.
 */
export function Pipe<A>(value: A): A;
export function Pipe<A, B>(value: A, fn1: (arg: A) => B): B;
export function Pipe<A, B, C>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C): C;
export function Pipe<A, B, C, D>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D): D;
// prettier-ignore
export function Pipe<A, B, C, D, E>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E): E;
// prettier-ignore
export function Pipe<A, B, C, D, E, F>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F): F;
// prettier-ignore
export function Pipe<A, B, C, D, E, F, G>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G): G;
// prettier-ignore
export function Pipe<A, B, C, D, E, F, G, H>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H): H;
// prettier-ignore
export function Pipe<A, B, C, D, E, F, G, H, I>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I): I;
// prettier-ignore
export function Pipe<A, B, C, D, E, F, G, H, I, J>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I, fn9: (arg: I) => J): J;
// prettier-ignore
export function Pipe<A, B, C, D, E, F, G, H, I, J, K>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I, fn9: (arg: I) => J, fn10: (arg: J) => K): K;

export function Pipe(value: any, ...fns: Function[]): any {
    return fns.reduce((acc, fn) => fn(acc), value);
}
