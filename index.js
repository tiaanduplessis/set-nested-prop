'use strict'

module.exports = function (
  obj,
  key,
  val,
  opts = {
    sep: '.',
    mut: false
  }
) {
  const newObj = JSON.parse(JSON.stringify(obj))
  ;(key.split ? key.split(opts.sep) : [key]).reduce((obj, key, index, arr) => {
    if (index === arr.length - 1) {
      obj[key] = val
      return
    }
    return obj[key]
  }, opts.mut ? obj : newObj)

  return opts.mut ? obj : newObj
}
