import { defineExtension, useCommand } from 'reactive-vscode'
import { ConfigurationTarget, commands, workspace } from 'vscode'
import { logger } from './logger'
import type { VimKeybinding } from './types'
import { vim2whichkey } from './utils'
import { scopedConfigs } from './generated/meta'
import * as Meta from './generated/meta'
import { configs } from './configs'

async function updateConfig() {
  const vimConfigs = workspace.getConfiguration('vim')
  const nnoremaps = vimConfigs.inspect<VimKeybinding[]>('normalModeKeyBindingsNonRecursive')?.globalValue

  if (nnoremaps) {
    const bindings = vim2whichkey(nnoremaps)

    await workspace
      .getConfiguration(scopedConfigs.scope)
      .update('bindings', bindings, ConfigurationTarget.Global)

    await commands.executeCommand('whichkey.register', {
      bindings: [Meta.scopedConfigs.scope, 'bindings'],
      overrides: [Meta.scopedConfigs.scope, 'bindingOverrides'],
      title: 'Genrated whichkey config',
    })

    logger.info('whichkey registered:', JSON.stringify(bindings, null, 2))

    return bindings
  }
  else {
    return Promise.reject(new Error('not find vim.normalModeKeyBindingsNonRecursive config'))
  }
}

export const { activate, deactivate } = defineExtension(async () => {
  await updateConfig()

  useCommand(Meta.commands.show, () => {
    if (configs.enable.value)
      commands.executeCommand('whichkey.show', Meta.configs.bindings.key)
    else
      commands.executeCommand('whichkey.show')
  })
  useCommand(Meta.commands.updateConfig, async () => await updateConfig())
  useCommand(Meta.commands.toggleEnable, async () => {
    configs.enable.value = !configs.enable.value
  })
})
