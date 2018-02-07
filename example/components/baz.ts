import { Component, RestrictedCtor } from '../..'
import { Types } from '.'

declare module '.' {
    interface Types {
        baz: string
    }
}

export const baz = (Component as RestrictedCtor<Types, 'baz'>)(
    ['foo', 'bar'],
    ({ foo, bar }) => (foo * bar * 5).toString()
)
