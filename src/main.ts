import { nanoid } from 'nanoid'

import { npmInstall } from '~/lib/utils.js'
import preInstalledDependencies from '~/pre-installed-dependencies.json'

async function mkcdWorkingDirectory() {
  const workingDirectory = path.join(process.env.HOME, '.run-zx')
  core.debug(`Creating working directory: ${workingDirectory}`)

  await io.mkdirP(workingDirectory)
  process.chdir(workingDirectory)

  actionState.workingDirectory = workingDirectory
  actionOutput.workingDirectory = workingDirectory
}

async function restoreCacheForDependencies() {
  await core.group(`Restoring cache for dependencies`, async () => {
    core.debug(`Cache key: ${actionInput.cacheKey}`)
    core.debug(`Cache restore keys: ${actionInput.cacheRestoreKeys.join(', ')}`)
    const hitKey = await cache.restoreCache(
      actionState.cachePaths,
      actionInput.cacheKey,
      actionInput.cacheRestoreKeys,
    )
    actionState.cacheHit = hitKey !== undefined
  })
}

async function writeScript() {
  const scriptFile = path.join(actionState.workingDirectory, `zx-${nanoid()}.${actionInput.scriptFileExt}`)
  core.debug(`Writing script file: ${scriptFile}`)

  await fs.writeFile(scriptFile, actionInput.script.join('\n'))
  await fs.chmod(scriptFile, 0o755)

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

      if (!actionInput.disablePreInstalledDependencies) {
        await npmInstall(...preInstalledDependencies)
        actionOutput.preInstalledDependencies = preInstalledDependencies
      }
      else { actionOutput.preInstalledDependencies = [] }

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
