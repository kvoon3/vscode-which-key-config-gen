import { defineConfigs } from 'reactive-vscode'
import { workspace } from 'vscode'
import type { ScopedConfigKeyTypeMap } from './generated/meta'
import { scopedConfigs } from './generated/meta'

export const configs = defineConfigs<ScopedConfigKeyTypeMap>(
  scopedConfigs.scope,
  scopedConfigs.defaults,
)
