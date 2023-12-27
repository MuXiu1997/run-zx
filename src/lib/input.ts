import { createHash } from 'node:crypto'

import preInstalledDependencies from '~/pre-installed-dependencies.json'

function calcCacheKey(zxVersion: string, disablePreInstalledDependencies: boolean, dependencies: string[]): string {
  return createHash('sha256')
    .update(`zx@${zxVersion}`)
    .update('\n')
    .update((disablePreInstalledDependencies ? [] : preInstalledDependencies).join('\n'))
    .update('\n')
    .update(dependencies.join('\n'))
    .digest('hex')
}

const actionInput = {
  get zxVersion() {
    return core.getInput('zx-version', { required: true })
  },
  get disablePreInstalledDependencies() {
    try {
      return core.getBooleanInput('disable-pre-installed-dependencies', { trimWhitespace: true })
    }
    catch (e) {
      return false
    }
  },
  get dependencies() {
    return core.getMultilineInput('dependencies', { trimWhitespace: true })
  },
  get cacheKey() {
    return core.getInput('cache-key', { trimWhitespace: true })
      || `run-zx-${actionRunner.os}-${calcCacheKey(this.zxVersion, this.disablePreInstalledDependencies, this.dependencies)}`
  },
  get cacheRestoreKeys() {
    const input = core.getMultilineInput('cache-restore-keys', { trimWhitespace: true })
    if (input.length === 0) return [`run-zx-${actionRunner.os}-`]
  },
  get script() {
    return core.getMultilineInput('script')
  },
  get scriptFileExt() {
    return core.getInput('script-file-ext', { required: true })
  },
  get zxCommand() {
    return core.getInput('zx-command', { required: true })
  },
} as const

export default actionInput
