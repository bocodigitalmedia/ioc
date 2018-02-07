import { Component, Factory } from './component'
import { Graph, validate } from './graph'

export type Components<T> = {
    [key in keyof T]: Component<T[key], keyof T, any>
}
export type Promises<T> = { [key in keyof T]: Promise<T[key]> }
export type Injection<T, K extends keyof T> = { [key in K]: T[key] }

export class Container<T> {
    constructor(
        public components: Components<T>,
        public promises: Partial<Promises<T>> = {}
    ) {}

    promise<K extends keyof T>(key: K): Promise<T[K]> | undefined {
        return this.promises[key]
    }

    component<K extends keyof T>(key: K): Component<T[K], keyof T, any> {
        return this.components[key]
    }

    resolve<K extends keyof T>(
        key: K,
        validate: boolean = true
    ): Promise<T[K]> {
        return (
            this.promise(key) ||
            Promise.resolve()
                .then(() => (validate ? this.validateGraph() : undefined))
                .then(() => (this.promises[key] = this.createPromise(key)))
        )
    }

    createPromise<K extends keyof T>(key: K): Promise<T[K]> {
        const { depends, factory } = this.component(key)
        return this.inject(depends, factory, false)
    }

    depends<K extends keyof T>(key: K): (keyof T)[] {
        return this.component(key).depends
    }

    keys(): (keyof T)[] {
        return Object.keys(this.components) as (keyof T)[]
    }

    graph(): Graph<keyof T> {
        return this.keys().reduce(
            (memo, key) => ({ ...(memo as any), [key]: this.depends(key) }),
            {} as Graph<keyof T>
        )
    }

    validateGraph(): void {
        return validate(this.graph())
    }

    resolveAll<K extends keyof T>(
        keys: K[],
        validate: boolean = true
    ): Promise<T[K][]> {
        return Promise.all(keys.map(key => this.resolve(key, validate)))
    }

    injection<K extends keyof T>(
        keys: K[],
        validate: boolean = true
    ): Promise<Injection<T, K>> {
        return this.resolveAll(keys, validate).then(
            (vals: T[K][]) =>
                keys.reduce(
                    (acc, k, i) => ({ ...acc, [k]: vals[i] }),
                    {}
                ) as Injection<T, K>
        )
    }

    inject<K extends keyof T, R>(
        depends: K[],
        factory: Factory<R, Injection<T, K>>,
        validate: boolean = true
    ): Promise<R> {
        return this.injection(depends, validate).then(factory)
    }
}
