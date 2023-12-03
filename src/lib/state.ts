const actionState = {
  get workingDirectory() {
    return core.getState('working-directory')
  },
  set workingDirectory(value: string) {
    core.saveState('working-directory', value)
  },
}

export default actionState
