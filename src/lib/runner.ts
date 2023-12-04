const actionRunner = {
  get os() {
    return process.env.RUNNER_OS
  },
  get arch() {
    return process.env.RUNNER_ARCH
  },
}

export default actionRunner
