import { basename } from 'node:path'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { vimToWhichKey } from '../src/utils'

describe('which key', async () => {
  const filePaths = await fg(['./fixtures/*'])
  for (const filePath of filePaths) {
    it(basename(filePath), async () => {
      const settingsJson = await import(filePath).then(i => i.default)
      const nnoremap = settingsJson['vim.normalModeKeyBindingsNonRecursive'] || []
      const vnoremap = settingsJson['vim.visualModeKeyBindingsNonRecursive'] || []
      const output = {
        normal: vimToWhichKey(nnoremap),
        visual: vimToWhichKey(vnoremap),
      }
      expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(`./.output/${basename(filePath)}`)
    })
  }
})
