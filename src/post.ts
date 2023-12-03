async function saveCacheForDependencies() {
  await cache.saveCache(
    [path.join(actionState.workingDirectory, 'node_modules')],
    actionInput.cacheKey,
  )
}

async function main() {
  await saveCacheForDependencies()
}

await main()
