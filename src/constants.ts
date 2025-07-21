import type { VSCodeVimMode } from 'vimrc-parser'

export type Mode = 'normal' | 'visual' | 'insert'
export const modeVimConfigMap: Record<Mode, VSCodeVimMode[]> = {
  normal: [
    'normalModeKeyBindings',
    'normalModeKeyBindingsNonRecursive',
  ],
  visual: [
    'visualModeKeyBindings',
    'visualModeKeyBindingsNonRecursive',
  ],
  insert: [
    'insertModeKeyBindings',
    'insertModeKeyBindingsNonRecursive',
  ],
}
