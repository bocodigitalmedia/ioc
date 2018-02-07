export interface Types {}

import { bar } from './bar'
import { baz } from './baz'
import { foo } from './foo'
import { Components } from '../..'

export const components: Components<Types> = { foo, bar, baz }
