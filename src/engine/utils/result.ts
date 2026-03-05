// engine/utils/result.ts
export type Result<T, E = string> = Ok<T> | Err<E>;
export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E = string>(error: E): Err<E> => ({ ok: false, error });

export function is_ok<T, E>(r: Result<T, E>): r is Ok<T> { return r.ok; }
export function is_err<T, E>(r: Result<T, E>): r is Err<E> { return !r.ok; }

export function unwrap_or<T, E>(r: Result<T, E>, fallback: T): T {
    return r.ok ? r.value : fallback;
}

export function unwrap<T, E>(r: Result<T, E>): T {
    if (r.ok) return r.value;
    throw new Error(String(r.error));
}
