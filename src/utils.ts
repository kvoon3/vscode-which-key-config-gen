import { computed, useActiveTextEditor, useTextEditorSelection } from 'reactive-vscode'
import { workspace } from 'vscode'
import type { VimKeybinding, WhichKeyBinding, WhichKeyCommand, WhichKeyItem } from './types'

const isBinding = (item: WhichKeyItem): item is WhichKeyBinding => item.type === 'bindings'
const isCommand = (item: WhichKeyItem): item is WhichKeyCommand => item.type === 'command' || item.type === 'commands'

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

export function genWhichKeyTree(keys: string[], commands: string[], names: string[] = []): WhichKeyItem {
  const [key, ...restKey] = keys
  const [name, ...restName] = names

  return restKey.length === 0
    ? commands.length > 1
      ? {
          key,
          type: 'commands',
          name,
          commands,
        }
      : {
          key,
          type: 'command',
          name,
          command: commands[0],
        }
    : {
        key,
        type: 'bindings',
        name,
        bindings: [genWhichKeyTree(restKey, commands, restName)],
      }
}

export function getWhichkeyConfig() {
  const activeTextEditor = useActiveTextEditor()
  const selection = useTextEditorSelection(activeTextEditor)

  const vimMode = computed(() => selection.value.isEmpty ? 'normal' : 'visual')

  const modeNameMap = {
    normal: [
      'normalModeKeyBindings',
      'normalModeKeyBindingsNonRecursive',
    ],
    visual: [
      'visualModeKeyBindings',
      'visualModeKeyBindingsNonRecursive',
    ],
    insert: [
      'insertModeKeyBindings',
      'insertModeKeyBindingsNonRecursive',
    ],
  }

  return vim2whichkey(modeNameMap[vimMode.value]
    .flatMap(i => workspace.getConfiguration('vim').inspect<VimKeybinding[]>(i)?.globalValue || [])
    .filter(i => i.names?.length))
}

export function vim2whichkey(vimKeybindings: VimKeybinding[]): WhichKeyItem[] {
  return vimKeybindings
    .filter(keybinding =>
      !keybinding?.commands?.includes('whichkey.show')
      && !keybinding?.commands?.includes('whichKeyConfigGen.show')
      && keybinding.before[0] === 'leader',
    )
    .reduce((whichKeyBindings, vimKeybinding) => {
      const { before: keys, commands, names } = vimKeybinding
      const [_, ...keys4bind] = keys

      const { parent, restKeys, restNames } = findParent(whichKeyBindings, keys4bind, 'root', names)

      if (parent === 'root') {
        return [...whichKeyBindings, genWhichKeyTree(restKeys, commands, restNames)]
      }
      else {
        parent.bindings.push(genWhichKeyTree(restKeys, commands, restNames))
        return whichKeyBindings
      }
    }, [] as WhichKeyItem[])
}
