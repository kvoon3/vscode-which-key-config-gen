import type { VSCodeVimMode } from 'vimrc-parser'
import { computed, defineExtension, useActiveTextEditor, useCommand, useTextEditorSelection } from 'reactive-vscode'
import { parseVimrc } from 'vimrc-parser'
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

  type Mode = 'normal' | 'visual' | 'insert'

  const vimMode = computed(() => selection.value.isEmpty ? 'normal' : 'visual')

  const modeVimConfigMap: Record<Mode, VSCodeVimMode[]> = {
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

  const vimConfig = workspace.getConfiguration('vim')

  const parsedVimrcConfigs = parseVimrc(vimConfig.inspect('vimrc.value')?.globalValue as [] || [])

  return vimToWhichKey(
    modeVimConfigMap[vimMode.value].flatMap((i) => {
      return [
        ...vimConfig.inspect(i)?.globalValue as [] || [],
        ...parsedVimrcConfigs[i] || [],
      ]
    }).filter(i => i.names?.length),
  )
}
