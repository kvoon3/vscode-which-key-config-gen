import { defineExtension, useCommand, watch } from 'reactive-vscode'
import { ConfigurationTarget, commands, workspace } from 'vscode'
import { logger } from './logger'
import type { VimKeybinding } from './types'
import { trans } from './utils'
import { scopedConfigs } from './generated/meta'
import * as Meta from './generated/meta'

function updateConfig() {
  const vimConfigs = workspace.getConfiguration('vim')
  const nnoremaps = vimConfigs.inspect<VimKeybinding[]>('normalModeKeyBindingsNonRecursive')?.globalValue

  if (nnoremaps) {
    const bindings = trans(nnoremaps)
    return workspace
      .getConfiguration(scopedConfigs.scope)
      .update('bindings', bindings, ConfigurationTarget.Global)
      .then(() => {
        return bindings
      })
  }
  else {
    return Promise.reject(new Error('no nnoremaps'))
  }
}

export const { activate, deactivate } = defineExtension(async () => {
  logger.show()

  const bindings = await updateConfig()
  logger.info(JSON.stringify(bindings, null, 2))
  commands.executeCommand('whichkey.register', {
    bindings: [Meta.scopedConfigs.scope, 'bindings'],
    overrides: [Meta.scopedConfigs.scope, 'bindingOverrides'],
    title: 'Genrated whichkey config',
  })

  useCommand(Meta.commands.show, () => commands.executeCommand('whichkey.show', Meta.configs.bindings.key))
  useCommand(Meta.commands.updateConfig, async () => {
    const bindings = await updateConfig()
    logger.info(JSON.stringify(bindings, null, 2))
  })
})
