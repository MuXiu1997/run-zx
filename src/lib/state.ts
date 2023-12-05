let workingDirectory: string | undefined
const actionState = {
  get workingDirectory() {
    if (workingDirectory === undefined) workingDirectory = core.getState('working-directory')
    return workingDirectory!
  },
  set workingDirectory(value: string) {
    workingDirectory = value
    core.saveState('working-directory', workingDirectory!)
  },
  get cachePaths() {
    return [
      path.join(this.workingDirectory, 'node_modules'),
      path.join(this.workingDirectory, 'package.json'),
    ]
  },
}

export default actionState
