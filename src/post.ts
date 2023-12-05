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
  await saveCacheForDependencies()
}

await main()
