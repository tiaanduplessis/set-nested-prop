function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function set (
  obj,
  key = '',
  val,
  {
    delimiter = '.',
    force = false,
    mut = false
  } = {}
) {
  const parts = key.split ? key.split(delimiter) : [key]
  const baseObj = mut ? obj : clone(obj)

  parts.reduce((obj, key, index, arr) => {
    const isLastPart = index === arr.length - 1

    if (isLastPart) {
      obj[key] = val
      return
    }

    if (force && !obj[key]) {
      obj[key] = {}
    }

    return obj[key]
  }, baseObj)

  return baseObj
}

function validArrays (arr1 = [], arr2 = []) {
  return Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length
}

export default function setNestedProp (obj,
  key,
  val,
  config = {}) {
  if (validArrays(key, val)) {
    return key.reduce((acc, key, i) => {
      return set(acc, key, val[i], config)
    }, obj)
  }

  return set(obj, key, val, config)
}
