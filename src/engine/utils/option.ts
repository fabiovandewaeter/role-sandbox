// engine/utils/option.ts
export type Opt<T> = Some<T> | None;
export type Some<T> = { kind: "some"; value: T };
export type None = { kind: "none" };

export const some = <T>(value: T): Opt<T> => ({ kind: "some", value });
export const none: Opt<never> = { kind: "none" };

export const is_some = <T>(opt: Opt<T>): opt is Some<T> => opt.kind === "some";
export const is_none = <T>(opt: Opt<T>): opt is None => opt.kind === "none";

/** unwrap with fallback */
export const unwrap_or = <T>(opt: Opt<T>, fallback: T): T =>
    is_some(opt) ? opt.value : fallback;

/** unwrap or throw (like Rust’s expect/unwrap) */
export const unwrap = <T>(opt: Opt<T>, msg?: string): T => {
    if (is_some(opt)) return opt.value;
    throw new Error(msg ?? "Tried to unwrap a None");
};

/** map over value if Some */
export const map = <T, U>(opt: Opt<T>, fn: (v: T) => U): Opt<U> =>
    is_some(opt) ? some(fn(opt.value)) : none;
