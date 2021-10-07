import _isUndefined from 'lodash/isUndefined'

export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const strX = JSON.stringify(args)
    const result = cache.get(strX)
    if (!_isUndefined(result)) {
      return result
    }

    cache.set(
      strX,
      fn(...args).catch((err) => {
        cache.delete(strX)
        return err
      })
    )
    return cache.get(strX)
  }
}
