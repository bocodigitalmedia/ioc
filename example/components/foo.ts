import { Component, RestrictedCtor } from '../..'
import { Types } from '.'

declare module '.' {
    interface Types {
        foo: number
    }
}

export const foo = (Component as RestrictedCtor<Types, 'foo'>)([], () => 5)
