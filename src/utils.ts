import type { VimKeybinding, WhichKeyBinding, WhichKeyCommand, WhichKeyItem } from './types'

const isBinding = (item: WhichKeyItem): item is WhichKeyBinding => item.type === 'bindings'
const isCommand = (item: WhichKeyItem): item is WhichKeyCommand => item.type === 'command'

export function findParent(
  nodes: WhichKeyItem[],
  keys: string[],
  maybeParent: WhichKeyBinding | 'root' = 'root',
): { parent: WhichKeyBinding | 'root', restKeys: string[] } {
  const [key, ...restKeys] = keys
  const target = nodes.find(i => i.key === key)

  if (!target)
    return { parent: maybeParent, restKeys: keys }

  // target: sibling
  if (isCommand(target))
    return { parent: maybeParent, restKeys: keys }

  if (isBinding(target)) {
    if (restKeys.length === 0)
      return { parent: maybeParent, restKeys: [] }

    // target: parent
    if (restKeys.length === 1)
      return { parent: target, restKeys }
    // target: ancestor
    else
      return findParent(target.bindings, restKeys, target)
  }

  return { parent: 'root', restKeys: keys }
}
export function genWhichKeyTree(keys: string[], command: string): WhichKeyItem {
  if (keys.length === 1) {
    return {
      key: keys[0],
      type: 'command',
      command,
    } as WhichKeyCommand
  }

  const [key, ...restKey] = keys

  return {
    key,
    type: 'bindings',
    bindings: [genWhichKeyTree(restKey, command)],
  } as WhichKeyBinding
}

export function trans(vimKeybindings: VimKeybinding[]): WhichKeyItem[] {
  return vimKeybindings
    .filter(keybinding =>
      !keybinding?.commands.includes('whichkey.show')
      && !keybinding?.commands.includes('whichKeyConfigGen.show')
      && keybinding.before[0] === 'leader',
    )
    .reduce((whichKeyBindings, vimKeybinding) => {
      const [_, ...keys2bind] = vimKeybinding.before
      const [command] = vimKeybinding.commands

      const { parent, restKeys } = findParent(whichKeyBindings, keys2bind)

      if (parent === 'root') {
        return [...whichKeyBindings, genWhichKeyTree(restKeys, command)]
      }
      else {
        parent.bindings.push(genWhichKeyTree(restKeys, command))
        return whichKeyBindings
      }
    }, [] as WhichKeyItem[])
}
