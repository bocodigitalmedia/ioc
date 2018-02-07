import { Container } from '..'
import { Types, components } from './components'

export const container = new Container<Types>(components)

container
    .inject(['foo', 'bar', 'baz'], ({ foo, bar, baz }) =>
        console.log({ foo, bar, baz })
    )
    .catch(console.error.bind(console, 'KO'))
