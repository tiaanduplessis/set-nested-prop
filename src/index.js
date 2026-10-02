function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function propertyKey (key) {
  if (typeof key === 'string' || typeof key === 'symbol') {
    return key
  }

  // defineProperty uses the same key coercion as the eventual property write.
  const property = Object.create(null)
  Object.defineProperty(property, key, {value: true})
  const names = Object.getOwnPropertyNames(property)
  return names.length ? names[0] : Object.getOwnPropertySymbols(property)[0]
}

function pathParts (key = '', delimiter = '.') {
  const parts = key.split ? key.split(delimiter) : [key]
  const keys = parts.map(propertyKey)

  keys.forEach((key, index) => {
    if (key === '__proto__' || key === 'prototype' ||
      (key === 'constructor' && index !== keys.length - 1)) {
      throw new TypeError('Unsafe property path')
    }
  })

  return keys
}

function set (
  obj,
  parts,
  val,
  {
    force = false,
    mut = false
  } = {}
) {
  const baseObj = mut ? obj : clone(obj)

  parts.reduce((obj, key, index, arr) => {
    const isLastPart = index === arr.length - 1

    if (isLastPart) {
      obj[key] = val
      return
    }

    const own = Object.prototype.hasOwnProperty.call(obj, key)

    if (force && !own) {
      Object.defineProperty(obj, key, {
        value: {},
        configurable: true,
        enumerable: true,
        writable: true
      })
    } else if (force && !obj[key]) {
      obj[key] = {}
    } else if (!own) {
      throw new TypeError('Cannot traverse an inherited property')
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
  const batch = validArrays(key, val)
  const keys = batch ? key : [key]
  const values = batch ? val : [val]
  const paths = keys.map(key => pathParts(key, config.delimiter))

  return paths.reduce((acc, parts, i) => {
    return set(acc, parts, values[i], config)
  }, obj)
}
