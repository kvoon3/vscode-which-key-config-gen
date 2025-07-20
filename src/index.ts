import type { VimKeybinding } from './types'
import { computed, defineExtension, useActiveTextEditor, useCommand, useTextEditorSelection } from 'reactive-vscode'
import { commands, workspace } from 'vscode'
import { configs } from './configs'
import * as Meta from './generated/meta'
import { vimToWhichKey } from './utils'

export const { activate, deactivate } = defineExtension(async () => {
  useCommand(Meta.commands.show, () => {
    commands.executeCommand('whichkey.show', getWhichkeyConfig())
  })

  useCommand(Meta.commands.toggleEnable, async () => configs.enable.value = !configs.enable.value)
})

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

  return vimToWhichKey(modeNameMap[vimMode.value]
    .flatMap(i => workspace.getConfiguration('vim').inspect<VimKeybinding[]>(i)?.globalValue || [])
    .filter(i => i.names?.length))
}
