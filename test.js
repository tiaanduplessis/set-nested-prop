/* eslint-env jest */
'use strict'

const set = require('./')

test('should exist', () => {
  expect(set).toBeDefined()
  expect(typeof set).toBe('function')
})

test('should set nested property without mutation', () => {
  const obj = {
    foo: {
      bar: {
        baz: 5
      }
    }
  }

  expect(set(obj, 'foo.bar.baz', 6).foo.bar.baz).toBe(6)
  expect(set(obj, 'baz', 6).baz).toBe(6)
  expect(set(obj, 'foo*bar*baz', 7, { sep: '*' }).foo.bar.baz).toBe(7)
  expect(obj.foo.bar.baz).toBe(5)
})

test('should set and mutate object', () => {
  const obj = {
    foo: 5
  }

  expect(set(obj, 'foo', 6, { mut: true }).foo).toBe(6)
  expect(obj.foo).toBe(6)
})
