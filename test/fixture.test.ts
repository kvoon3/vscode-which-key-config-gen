import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import fg from 'fast-glob'
import { vim2whichkey } from '../src/utils'
import { configs } from '../src/generated/meta'

describe('which key', async () => {
  const filePaths = await fg(['./fixtures/*'])
  for (const filePath of filePaths) {
    it(basename(filePath), async () => {
      const settingsJson = await import(filePath).then(i => i.default)
      const nnoremap = settingsJson['vim.normalModeKeyBindingsNonRecursive'] || []
      const vnoremap = settingsJson['vim.visualModeKeyBindingsNonRecursive'] || []
      const output = {
        [configs.NormalModeNonRecursiveKeybindings.key]: vim2whichkey(nnoremap),
        [configs.VisualModeNonRecursiveKeybindings.key]: vim2whichkey(vnoremap),
      }
      expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(`./.output/${basename(filePath)}`)
    })
  }
})
