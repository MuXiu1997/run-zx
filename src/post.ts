async function saveCacheForDependencies() {
  await core.group(`Saving cache for dependencies`, async () => {
    core.debug(`Cache key: ${actionInput.cacheKey}`)
    await cache.saveCache(
      actionState.cachePaths,
      actionInput.cacheKey,
    )
  })
}

async function main() {
  if (actionState.cacheHit) {
    core.info('Cache hit occurred, skipping save cache')
    return
  }
  await saveCacheForDependencies()
}

await main()
