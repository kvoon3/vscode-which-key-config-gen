import { computed, defineExtension, useActiveTextEditor, useCommand, useTextEditorSelection, watchEffect } from 'reactive-vscode'
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

    // logger.info('whichkey registered:', JSON.stringify(whichkeybindings, null, 2))

    return whichkeybindings
  }

  return Promise.all([
    genBindings('normalModeNonRecursiveKeybindings', nnoremaps),
    genBindings('visualModeNonRecursiveKeybindings', vnoremaps),
  ])
}

export const { activate, deactivate } = defineExtension(async () => {
  const activeTextEditor = useActiveTextEditor()
  const selection = useTextEditorSelection(activeTextEditor)

  const vimMode = computed(() => selection.value.isEmpty ? 'normal' : 'visual')

  watchEffect(() => logger.info('vimMode', vimMode.value))

  const whichKeyBindings = computed<Meta.ConfigKey | undefined>(() => {
    if (!configs.enable.value)
      return undefined

    if (vimMode.value === 'normal')
      return Meta.configs.normalModeNonRecursiveKeybindings.key

    if (vimMode.value === 'visual')
      return Meta.configs.visualModeNonRecursiveKeybindings.key

    return undefined
  })

  try {
    await updateConfig()
  }
  catch (error) {
    logger.error(error)
  }
  finally {
    useCommand(Meta.commands.show, () => {
      logger.info('vimMode', vimMode.value)
      logger.info(`show ${whichKeyBindings.value}`)
      commands.executeCommand('whichkey.show', whichKeyBindings.value)
    })
    useCommand(Meta.commands.updateConfig, async () => await updateConfig())
    useCommand(Meta.commands.toggleEnable, async () => configs.enable.value = !configs.enable.value)
  }
})
