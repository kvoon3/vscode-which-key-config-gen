import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import fg from 'fast-glob'
import { vim2whichkey } from '../src/utils'

describe('which key', async () => {
  const filePaths = await fg(['./fixtures/*'])
  for (const filePath of filePaths) {
    it(basename(filePath), async () => {
      const settingsJson = await import(filePath).then(i => i.default)
      const vimKeyBindings = settingsJson['vim.normalModeKeyBindingsNonRecursive']
      expect(JSON.stringify(vim2whichkey(vimKeyBindings), null, 2)).toMatchFileSnapshot(`./.output/${basename(filePath)}`)
    })
  }
})
