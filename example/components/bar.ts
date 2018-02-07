import { Component, RestrictedCtor } from '../..'
import { Types } from '.'

declare module '.' {
    interface Types {
        bar: number
    }
}

export const bar = (Component as RestrictedCtor<Types, 'bar'>)(
    ['foo'],
    ({ foo }) => foo * 5
)
