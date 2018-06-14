import set from 'set-nested-prop'

// By default the original object is not modified and . is used as a seperator

const obj1 = {
  foo: {
    bar: {
      baz: 5
    }
  }
}

const newObj = set(obj1, 'foo.bar.baz', 6)
console.log(newObj) // { foo: { bar: { baz: 6 } } }
console.log(obj1) // { foo: { bar: { baz: 5 } } }

// You can opt in for mutating
const obj2 = {
  foo: 5
}

set(obj2, 'foo', 6, { mut: true })
console.log(obj2.foo) // 6

// A custom seperator can be used

const customObj = set(obj1, 'foo*bar*baz', 7, { sep: '*' })
console.log(customObj) // { foo: { bar: { baz: 7 } } }

const forceObj = {}
const forceObjResult = set(forceObj, 'foo.bar', 1, {force: true})
console.log(forceObjResult) // {foo: {bar: 1}}
