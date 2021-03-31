function withRetry(fn, n) {
  let retryTimes = 0
  const fnInternal = (...args) =>
    new Promise(resolve => resolve(fn(...args))).catch(error =>
      ++retryTimes > n ? Promise.reject(error) : fnInternal(...args)
    )

  return fnInternal
}