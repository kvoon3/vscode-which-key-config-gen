import { defineExtension, useCommand } from 'reactive-vscode'
import { commands, workspace } from 'vscode'
import { logger } from './logger'
import type { VimKeybinding } from './types'
import { trans } from './utils'
import { configs } from './configs'

export const { activate, deactivate } = defineExtension(() => {
  // logger.show()
  const vimConfigs = workspace.getConfiguration('vim')

  const nnoremaps = vimConfigs.inspect<VimKeybinding[]>('normalModeKeyBindingsNonRecursive')?.globalValue

  if (nnoremaps) {
    const whichKeyKeyBindings = trans(nnoremaps)
    configs.bindingOverrides.value = whichKeyKeyBindings

    commands.executeCommand('whichkey.register', {
      bindings: ['whichkeyConfigGen', 'bindings'],
      overrides: ['whichkeyConfigGen', 'bindingOverrides'],
      title: 'generated whichkey config',
    })

    useCommand('whichkeyConfigGen.show', () => commands.executeCommand('whichkey.show', 'whichkeyConfigGen.bindings'))
  }
})
