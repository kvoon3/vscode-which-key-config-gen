import type { ScopedConfigKeyTypeMap } from './generated/meta'
import { defineConfigs } from 'reactive-vscode'
import { scopedConfigs } from './generated/meta'

export const configs = defineConfigs<ScopedConfigKeyTypeMap>(
  scopedConfigs.scope,
  scopedConfigs.defaults,
)
