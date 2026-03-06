// engine/utils/option.ts
// export type Opt<T> = Some<T> | None;
// export type Some<T> = { kind: "some"; value: T };
// export type None = { kind: "none" };
export abstract class Opt<T> {
    abstract is_some(): this is Some<T>;
    abstract is_none(): this is None;
    /** unwrap or throw (like Rust’s expect/unwrap) */
    abstract unwrap(msg?: string): T;
    /** unwrap with fallback */
    abstract unwrap_or(fallback: T): T;
    /** map over value if Some */
    abstract map<U>(fn: (v: T) => U): Opt<U>;
}

export class Some<T> extends Opt<T> {
    constructor(public readonly value: T) { super(); }

    is_some(): this is Some<T> { return true; }
    is_none(): this is None { return false; }
    unwrap(msg?: string): T { return this.value; }
    unwrap_or(_: T): T { return this.value; }
    map<U>(fn: (v: T) => U): Opt<U> { return new Some(fn(this.value)); }
}

export class None<T = never> extends Opt<T> {
    constructor() { super() }

    is_some(): this is Some<T> { return false; }
    is_none(): this is None { return true; }
    unwrap(msg?: string): T { throw new Error(msg ?? "Tried to unwrap a None"); }
    unwrap_or(fallback: T) { return fallback; }
    map<U>(_: (v: T) => U): Opt<U> { return new None(); }
}

export const some = <T>(value: T): Opt<T> => new Some(value);
export const none: Opt<never> = new None;
