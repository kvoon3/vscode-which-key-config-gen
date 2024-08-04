import { describe, expect, it } from 'vitest'
import { findParent } from '../src/utils'
import type { WhichKeyItem } from '../src/types'

const whichKeyKeybindings: WhichKeyItem[] = [
  {
    key: 'a',
    type: 'bindings',
    bindings: [
      {
        key: 'b',
        type: 'bindings',
        bindings: [
          { key: 'c', type: 'command', command: 'c command' },
          {
            key: 'd',
            type: 'bindings',
            bindings: [
              { key: 'e', type: 'command', command: 'e command' },
            ],
          },
        ],
      },
      { key: 'd', type: 'command', command: 'd command' },
    ],
  },
]

describe('find whichkey parent', () => {
  it('root', () => {
    const { parent, restKeys } = findParent(whichKeyKeybindings, ['b'])
    expect(parent).toBe('root')
    expect(restKeys).toEqual(['b'])
  })

  it('repeat bindings', () => {
    const { parent, restKeys } = findParent(whichKeyKeybindings, ['a'])
    expect(parent).toBe('root')
    expect(restKeys).toEqual([])
  })

  it('repeat command', () => {
    const { parent, restKeys } = findParent(whichKeyKeybindings, ['a', 'b', 'c'])
    // @ts-expect-error type error
    expect(parent.key).toBe('b')
    expect(restKeys).toEqual(['c'])
  })

  it('deep', () => {
    const { parent, restKeys } = findParent(whichKeyKeybindings, ['a', 'b', 'd', 'h'])
    // @ts-expect-error type error
    expect(parent.key).toBe('d')
    expect(restKeys).toEqual(['h'])
  })
})
