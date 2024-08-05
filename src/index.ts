import { computed, defineExtension, ref, useActiveTextEditor, useCommand, useTextEditorSelection, useVisibleTextEditors, watch } from 'reactive-vscode'
import { ConfigurationTarget, commands, workspace } from 'vscode'
import { logger } from './logger'
import type { VimKeybinding } from './types'
import { vim2whichkey } from './utils'
import { scopedConfigs } from './generated/meta'
import * as Meta from './generated/meta'
import { configs } from './configs'

async function updateConfig() {
  const vimConfigs = workspace.getConfiguration('vim')
  const nnoremaps = vimConfigs.inspect<VimKeybinding[]>('normalModeKeyBindingsNonRecursive')?.globalValue || []
  const vnoremaps = vimConfigs.inspect<VimKeybinding[]>('visualModeKeyBindingsNonRecursive')?.globalValue || []

  const genBindings = async (name: keyof Meta.ScopedConfigKeyTypeMap, vimKeybindings: VimKeybinding[]) => {
    const whichkeybindings = vim2whichkey(vimKeybindings)

    await workspace
      .getConfiguration(scopedConfigs.scope)
      .update(name, whichkeybindings, ConfigurationTarget.Global)

    await commands.executeCommand('whichkey.register', {
      bindings: [Meta.scopedConfigs.scope, name],
      title: 'Genrated whichkey config',
    })

    logger.info('whichkey registered:', JSON.stringify(whichkeybindings, null, 2))

    return whichkeybindings
  }

  return Promise.all([
    genBindings('NormalModeNonRecursiveKeybindings', nnoremaps),
    genBindings('VisualModeNonRecursiveKeybindings', vnoremaps),
  ])
}

export const { activate, deactivate } = defineExtension(async () => {
  const VimMode = ref< 'normal' | 'visual' | 'insert' | 'command' >('normal')

  const activeTextEditor = useActiveTextEditor()
  const selection = computed(() => useTextEditorSelection(activeTextEditor).value)

  watch(selection, s => VimMode.value = s.isEmpty ? 'normal' : 'visual')

  const whichKeyBindings = computed<Meta.ConfigKey | undefined>(() => {
    if (!configs.enable.value)
      return undefined

    if (VimMode.value === 'normal')
      return Meta.configs.NormalModeNonRecursiveKeybindings.key

    if (VimMode.value === 'visual')
      return Meta.configs.VisualModeNonRecursiveKeybindings.key

    return undefined
  })

  await updateConfig()

  useCommand(Meta.commands.show, () => {
    logger.info('VimMode', VimMode.value)
    logger.info(`show ${whichKeyBindings.value}`)
    commands.executeCommand('whichkey.show', whichKeyBindings.value)
  })
  useCommand(Meta.commands.updateConfig, async () => await updateConfig())
  useCommand(Meta.commands.toggleEnable, async () => configs.enable.value = !configs.enable.value)
})
