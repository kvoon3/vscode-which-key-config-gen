import { basename } from 'node:path'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { vim2whichkey } from '../src/utils'

describe('which key', async () => {
  const filePaths = await fg(['./fixtures/*'])
  for (const filePath of filePaths) {
    it(basename(filePath), async () => {
      const settingsJson = await import(filePath).then(i => i.default)
      const nnoremap = settingsJson['vim.normalModeKeyBindingsNonRecursive'] || []
      const vnoremap = settingsJson['vim.visualModeKeyBindingsNonRecursive'] || []
      const output = {
        normal: vim2whichkey(nnoremap),
        visual: vim2whichkey(vnoremap),
      }
      expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(`./.output/${basename(filePath)}`)
    })
  }
})
