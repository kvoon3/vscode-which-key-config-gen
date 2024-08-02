import type { VimKeybinding, WhichKeyBinding, WhichKeyCommand, WhichKeyItem } from './types'

const isBinding = (item: WhichKeyItem): item is WhichKeyBinding => item.type === 'bindings'
const isCommand = (item: WhichKeyItem): item is WhichKeyCommand => item.type === 'command'

export function trans(vimKeybindings: VimKeybinding[]): WhichKeyItem[] {
  function create(before: string[], command: string): WhichKeyItem {
    if (before.length === 1) {
      return {
        key: before[0],
        type: 'command',
        command,
      } as WhichKeyCommand
    }

    const [key, ...restKey] = before

    return {
      key,
      type: 'bindings',
      bindings: [create(restKey, command)],
    } as WhichKeyBinding
  }

  return vimKeybindings
    .filter(keybinding =>
      !keybinding?.commands.includes('whichkey.show')
      && !keybinding?.commands.includes('whichkeyConfigGen.show')
      && keybinding.before[0] === 'leader',
    )
    .reduce((accu, cur) => {
      const before = cur.before.splice(1)

      function finder(
        parent: WhichKeyBinding | 'root',
        targets: WhichKeyItem[],
        keys: string[],
        command: string,
      ): { target: WhichKeyBinding | 'root', keys: string[], command: string } {
        const [key, ...restKeys] = keys
        const target = targets.find(i => i.key === key)

        // not find
        if (!target) {
          return {
            target: parent,
            keys,
            command,
          }
        }

        if (isCommand(target)) {
          return {
            target: parent,
            keys: restKeys,
            command,
          }
        }

        // leader c N
        // leader c p p

        if (isBinding(target)) {
          if (restKeys.length === 1) {
            return {
              target,
              keys: restKeys,
              command,
            }
          }
          else {
            return finder(target, target.bindings, restKeys, command)
          }
        }

        return {
          target: 'root',
          keys,
          command,
        }
      }

      const { target, keys, command } = finder('root', accu, before, cur.commands[0])

      if (target === 'root') {
        return [
          ...accu,
          create(before, command),
        ]
      }
      else {
        target.bindings.push(create(keys, command))
        return accu
      }
    }, [] as WhichKeyItem[])
}
