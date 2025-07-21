import { basename } from 'node:path'
import { objectEntries } from '@antfu/utils'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { modeVimConfigMap } from '../src/constants'

describe('which key', async () => {
  const filePaths = await fg(['./fixtures/*'])
  for (const filePath of filePaths) {
    it(basename(filePath), async () => {
      const settingsJson = await import(filePath).then(i => i.default)

      const output = Object.fromEntries(objectEntries(modeVimConfigMap).map(([mode, keys]) => {
        return [mode, keys.flatMap(key => settingsJson[`vim.${key}`]).filter(Boolean)]
      }))

      expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(`./.output/${basename(filePath)}`)
    })
  }
})
