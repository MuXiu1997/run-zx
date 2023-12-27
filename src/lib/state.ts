let workingDirectory: string | undefined
let cacheHit: boolean | undefined

const actionState = {
  get workingDirectory() {
    if (workingDirectory === undefined) workingDirectory = core.getState('working-directory')
    return workingDirectory!
  },
  set workingDirectory(value: string) {
    workingDirectory = value
    core.saveState('working-directory', workingDirectory!)
  },
  get cacheHit() {
    if (cacheHit === undefined) cacheHit = core.getState('cache-hit') === 'true'
    return cacheHit!
  },
  set cacheHit(value: boolean) {
    cacheHit = value
    core.saveState('cache-hit', cacheHit ? 'true' : 'false')
  },
  get cachePaths() {
    return [
      path.join(this.workingDirectory, 'node_modules'),
      path.join(this.workingDirectory, 'package.json'),
    ]
  },
}

export default actionState
