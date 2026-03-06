// engine/utils/result.ts
export abstract class Result<T, E = string> {
    abstract is_ok(): this is Ok<T, E>;
    abstract is_err(): this is Err<T, E>;
    abstract unwrap(): T;
    abstract unwrap_or(fallback: T): T;
    abstract map<U>(fn: (val: T) => U): Result<U, E>;
}

export class Ok<T, E = string> extends Result<T, E> {
    constructor(public readonly value: T) { super(); }

    is_ok(): this is Ok<T, E> { return true; }
    is_err(): this is Err<T, E> { return false; }
    unwrap(): T { return this.value; }
    unwrap_or(_: T): T { return this.value }
    map<U>(fn: (val: T) => U): Result<U, E> { return new Ok(fn(this.value)); }
}

export class Err<T = never, E = string> extends Result<T, E> {
    constructor(public readonly error: E) { super(); }

    is_ok(): this is Ok<T, E> { return false; }
    is_err(): this is Err<T, E> { return true; }
    unwrap(): T { throw new Error(String(this.error)); }
    unwrap_or(fallback: T): T { return fallback; }
    map<U>(_: (val: T) => U): Result<U, E> { return new Err(this.error); }
}

export const ok = <T, E = string>(value: T): Ok<T, E> => new Ok(value);
export const err = <E = string, T = never>(error: E): Err<T, E> => new Err(error);
