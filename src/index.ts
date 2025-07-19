import { computed, defineExtension, useActiveTextEditor, useCommand, useTextEditorSelection } from 'reactive-vscode'
import { commands, workspace } from 'vscode'
import type { VimKeybinding } from './types'
import { vim2whichkey } from './utils'
import * as Meta from './generated/meta'
import { configs } from './configs'

function useVimConfigs() {
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

  return computed(() => modeNameMap[vimMode.value]
    .flatMap(i => workspace.getConfiguration('vim').inspect<VimKeybinding[]>(i)?.globalValue || [])
    .filter(i => i.names?.length),
  )
}

export const { activate, deactivate } = defineExtension(async () => {
  const vimKeybindings = useVimConfigs()
  useCommand(Meta.commands.show, () => {
    const whichkey = vim2whichkey(vimKeybindings.value)

    commands.executeCommand('whichkey.show', whichkey)
  })
  useCommand(Meta.commands.toggleEnable, async () => configs.enable.value = !configs.enable.value)
})
