let workingDirectory = ''
let preInstalledDependencies = ''

const actionOutput = {
  get workingDirectory() {
    return workingDirectory
  },
  set workingDirectory(value: string) {
    workingDirectory = value
    core.setOutput('working-directory', workingDirectory)
  },

  get preInstalledDependencies(): string {
    return preInstalledDependencies
  },
  set preInstalledDependencies(value: string[]) {
    preInstalledDependencies = value.join('\n')
    core.setOutput('pre-installed-dependencies', preInstalledDependencies)
  },
}

export default actionOutput
