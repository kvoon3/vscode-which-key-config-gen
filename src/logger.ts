import { defineLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

const _logger = defineLogger(displayName)

export const logger = {
  ..._logger,
  log(...args: any[]) {
    for (const arg of args) {
      logger.info(JSON.stringify(arg, null, 2))
    }
  },
}
