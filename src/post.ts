async function saveCacheForDependencies() {
  await core.group(`Saving cache for dependencies`, async () => {
    core.debug(`Cache key: ${actionInput.cacheKey}`)
    await cache.saveCache(
      [path.join(actionState.workingDirectory, 'node_modules')],
      actionInput.cacheKey,
    )
  })
}

async function main() {
  await saveCacheForDependencies()
}

await main()
