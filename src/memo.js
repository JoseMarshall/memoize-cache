
const sortObjKey = (obj) => typeof obj === 'object' ?
  Object.keys(obj)
    .sort((a, b) => (a >= b ? 1 : -1))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {}) : obj;

export function memoize(fn) {

  let memo = {};

  return (...args) => {
    const key = JSON.stringify(args.map(k => sortObjKey(k)))
    return (key in memo) ? memo[key] : (memo[key] = fn.apply(this, args))
  };

}

let cached = {}
export function cache(fn) {

  const putInCache = (fn) => {
    cached[fn] = {
      argument: {},
      fn: (...args) => {
        const key = JSON.stringify(args.map(k => sortObjKey(k)))
        if (key in cached[fn].argument) {
          return cached[fn].argument[key].result
        } else {
          const result = fn.apply(this, args)
          cached[fn].argument[key] = {
            count: (cached[fn].argument[key]?.count ?? 0) + 1,
            result
          }
          return result
        }
      },
      hitCount(...args) {
        const key = JSON.stringify(args.map(k => sortObjKey(k)))
        return cached[fn]?.argument[key]?.count ?? 0
      },
      clear() {
        delete cached[fn]
      }
    }
  }

  if (!(fn in cached)) {
    cached[fn] = {}
    putInCache(fn)
  }

  return cached[fn]
}
