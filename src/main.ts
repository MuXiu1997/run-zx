import { nanoid } from 'nanoid'

import { npmInstall } from '~/lib/utils.js'
import preInstalledDependencies from '~/pre-installed-dependencies.json'

async function mkcdWorkingDirectory() {
  const workingDirectory = path.join(process.env.HOME, '.run-zx')

  await io.mkdirP(workingDirectory)
  process.chdir(workingDirectory)

  actionState.workingDirectory = workingDirectory
  actionOutput.workingDirectory = workingDirectory

  core.debug(`Working directory: ${workingDirectory}`)
}

async function restoreCacheForDependencies() {
  await cache.restoreCache(
    [path.join(actionState.workingDirectory, 'node_modules')],
    actionInput.cacheKey,
    actionInput.cacheRestoreKeys,
  )
}

async function writeScript() {
  const scriptFile = path.join(actionState.workingDirectory, `zx-${nanoid()}.${actionInput.scriptFileExt}`)
  core.debug(`Script file: ${scriptFile}`)

  await fs.writeFile(scriptFile, actionInput.script.join('\n'))
  await fs.chmod(scriptFile, 0o755)

  actionOutput.scriptFile = scriptFile

  return scriptFile
}

async function runScript(scriptFile: string) {
  const [cmd, ...args] = actionInput.zxCommand.replace('{0}', scriptFile).split(/\s+/)
  // if `FORCE_COLOR` is not set, then default to `1` to enable color output
  if (!process.env.FORCE_COLOR) process.env.FORCE_COLOR = '1'
  await exec.exec(cmd, args)
}

async function main() {
  try {
    await mkcdWorkingDirectory()
    await restoreCacheForDependencies()

    await core.group('Install dependencies', async () => {
      await npmInstall(`zx@${actionInput.zxVersion}`)
      core.addPath(path.join(actionState.workingDirectory, 'node_modules', '.bin'))

      await npmInstall(...preInstalledDependencies)
      actionOutput.preInstalledDependencies = preInstalledDependencies

      await npmInstall(...actionInput.dependencies)
    })

    const scriptFile = await writeScript()
    await runScript(scriptFile)
  }
  catch (e) {
    core.setFailed(e)
  }
}

await main()
