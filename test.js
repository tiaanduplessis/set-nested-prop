import set from './src/index'

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
  expect(set(obj, 'foo*bar*baz', 7, { delimiter: '*' }).foo.bar.baz).toBe(7)
  expect(obj.foo.bar.baz).toBe(5)
})

test('should set and mutate object', () => {
  const obj = {
    foo: 5
  }

  expect(set(obj, 'foo', 6, { mut: true }).foo).toBe(6)
  expect(obj.foo).toBe(6)
})

test('should create level if needed', () => {
  const obj = {}
  const result = set(obj, 'foo.bar', 1, {force: true})

  expect(result.foo.bar).toBe(1)
})

test('should set with array of keys & values', () => {
  const obj = {}
  const keys = ['foo', 'bar', 'foo.baz']
  const vals = [{}, 2, 3]

  const result = set(obj, keys, vals)
  expect(result.foo).toEqual({baz: 3})
  expect(result.bar).toBe(2)
})
