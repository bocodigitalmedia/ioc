export type Factory<T, A = {}> = (a: A) => T | Promise<T>

export interface RestrictedCtor<T, K extends keyof T> {
    <I extends keyof T>(
        depends: I[],
        factory: (a: { [key in I]: T[key] }) => T[K]
    ): Component<T[K], I, { [key in I]: T[key] }>
}

export interface Component<
    T,
    K extends string,
    I extends Partial<{ [key in K]: any }> = {}
> {
    depends: K[]
    factory: Factory<T, I>
}

export function Component<
    T,
    K extends string,
    I extends Partial<{ [key in K]: any }> = {}
>(depends: K[], factory: Factory<T, I>): Component<T, K, I> {
    return { depends, factory }
}
