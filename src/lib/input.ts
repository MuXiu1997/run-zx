const actionInput = {
  get zxVersion() {
    return core.getInput('zx-version', { required: true })
  },
  get dependencies() {
    return core.getMultilineInput('dependencies', { required: true })
  },
  get cacheKey() {
    return core.getInput('cache-key', { required: true })
  },
  get cacheRestoreKeys() {
    return core.getMultilineInput('cache-restore-keys')
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
