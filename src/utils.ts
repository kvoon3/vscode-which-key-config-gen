import type { VimKeybinding, WhichKeyBinding, WhichKeyCommand, WhichKeyItem } from './types'

const isBinding = (item: WhichKeyItem): item is WhichKeyBinding => item.type === 'bindings'
const isCommand = (item: WhichKeyItem): item is WhichKeyCommand => item.type === 'command'

export function findParent(
  nodes: WhichKeyItem[],
  keys: string[],
  maybeParent: WhichKeyBinding | 'root' = 'root',
  names: string[] = [],
): { parent: WhichKeyBinding | 'root', restKeys: string[], restNames: string[] } {
  const [key, ...restKeys] = keys
  const [_, ...restNames] = names
  const target = nodes.find(i => i.key === key)

  if (!target)
    return { parent: maybeParent, restKeys: keys, restNames: names }

  // target: sibling
  if (isCommand(target))
    return { parent: maybeParent, restKeys: keys, restNames: names }

  if (isBinding(target)) {
    if (restKeys.length === 0)
      return { parent: maybeParent, restKeys: [], restNames: [] }

    // target: parent
    if (restKeys.length === 1)
      return { parent: target, restKeys, restNames }
    // target: ancestor
    else
      return findParent(target.bindings, restKeys, target, restNames)
  }

  return { parent: 'root', restKeys: keys, restNames: names }
}
export function genWhichKeyTree(keys: string[], command: string, names: string[] = []): WhichKeyItem {
  const [key, ...restKey] = keys
  const [name, ...restName] = names

  return restKey.length === 0
    ? {
        key,
        type: 'command',
        name,
        command,
      }
    : {
        key,
        type: 'bindings',
        name,
        bindings: [genWhichKeyTree(restKey, command, restName)],
      }
}

export function vim2whichkey(vimKeybindings: VimKeybinding[]): WhichKeyItem[] {
  return vimKeybindings
    .filter(keybinding =>
      !keybinding?.commands.includes('whichkey.show')
      && !keybinding?.commands.includes('whichKeyConfigGen.show')
      && keybinding.before[0] === 'leader',
    )
    .reduce((whichKeyBindings, vimKeybinding) => {
      const { before: keys, commands, names } = vimKeybinding
      const [_, ...keys4bind] = keys
      const [command] = commands

      const { parent, restKeys, restNames } = findParent(whichKeyBindings, keys4bind, 'root', names)

      if (parent === 'root') {
        return [...whichKeyBindings, genWhichKeyTree(restKeys, command, restNames)]
      }
      else {
        parent.bindings.push(genWhichKeyTree(restKeys, command, restNames))
        return whichKeyBindings
      }
    }, [] as WhichKeyItem[])
}
