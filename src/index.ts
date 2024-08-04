import { defineExtension, useCommand, watch } from 'reactive-vscode'
import { ConfigurationTarget, commands, workspace } from 'vscode'
import { logger } from './logger'
import type { VimKeybinding } from './types'
import { trans } from './utils'
import { scopedConfigs } from './generated/meta'
import * as Meta from './generated/meta'

export const { activate, deactivate } = defineExtension(() => {
  logger.show()
  const vimConfigs = workspace.getConfiguration('vim')
  const nnoremaps = vimConfigs.inspect<VimKeybinding[]>('normalModeKeyBindingsNonRecursive')?.globalValue

  if (nnoremaps) {
    const bindings = trans(nnoremaps)
    workspace
      .getConfiguration(scopedConfigs.scope)
      .update('bindings', bindings, ConfigurationTarget.Global)
      .then(() => {
        logger.info(JSON.stringify(bindings, null, 2))

        commands.executeCommand('whichkey.register', {
          bindings: [Meta.scopedConfigs.scope, 'bindings'],
          overrides: [Meta.scopedConfigs.scope, 'bindingOverrides'],
          title: 'Genrated whichkey config',
        })

        useCommand(Meta.commands.show, () => commands.executeCommand('whichkey.show', Meta.configs.bindings.key))
      })
  }
})
