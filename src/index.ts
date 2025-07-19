import { defineExtension, useCommand } from 'reactive-vscode'
import { commands } from 'vscode'
import * as Meta from './generated/meta'
import { configs } from './configs'
import { getWhichkeyConfig } from './utils'

export const { activate, deactivate } = defineExtension(async () => {
  useCommand(Meta.commands.show, () => {
    commands.executeCommand('whichkey.show', getWhichkeyConfig())
  })

  useCommand(Meta.commands.toggleEnable, async () => configs.enable.value = !configs.enable.value)
})
