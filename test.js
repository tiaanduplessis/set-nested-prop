import sourceSet from './src/index'
import moduleSet from './dist/set-nested-prop.m'

const implementations = [
  {name: 'source', set: sourceSet},
  {name: 'CommonJS distribution', set: require('./dist/set-nested-prop')},
  {name: 'ES module distribution', set: moduleSet},
  {name: 'UMD distribution', set: require('./dist/set-nested-prop.umd')}
]

implementations.forEach(({name, set}) => {
  describe(name, () => {
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

    describe('unsafe property paths', () => {
      const unsafePaths = [
        '__proto__.polluted',
        'foo.__proto__.polluted',
        'constructor.prototype.polluted',
        'foo.constructor.prototype.polluted',
        'constructor.polluted',
        'toString.constructor.prototype.polluted',
        'prototype.polluted',
        'foo.prototype',
        '__proto__'
      ]

      ;[false, true].forEach(mut => {
        ;[false, true].forEach(force => {
          unsafePaths.forEach(path => {
            test(`rejects ${path} with mut=${mut}, force=${force}`, () => {
              const obj = {foo: {}}
              const originalPrototype = Object.getPrototypeOf(obj)
              const objectPrototype = Object.getOwnPropertyDescriptor(Object.prototype, 'polluted')
              const objectConstructor = Object.getOwnPropertyDescriptor(Object, 'polluted')
              const value = {polluted: true}

              try {
                expect(() => set(obj, path, value, {mut, force})).toThrow(TypeError)
                expect(obj).toEqual({foo: {}})
                expect(Object.getPrototypeOf(obj)).toBe(originalPrototype)
                expect(Object.getOwnPropertyDescriptor(Object.prototype, 'polluted')).toEqual(objectPrototype)
                expect(Object.getOwnPropertyDescriptor(Object, 'polluted')).toEqual(objectConstructor)
              } finally {
                if (objectPrototype) {
                  // Restore the descriptor only if a failing regression changed it.
                  // eslint-disable-next-line no-extend-native
                  Object.defineProperty(Object.prototype, 'polluted', objectPrototype)
                } else {
                  delete Object.prototype.polluted
                }
                if (objectConstructor) {
                  Object.defineProperty(Object, 'polluted', objectConstructor)
                } else {
                  delete Object.polluted
                }
              }
            })
          })
        })
      })

      test('rejects unsafe segments with a custom delimiter', () => {
        const obj = {foo: {}}

        ;['foo*__proto__*polluted', 'constructor*prototype*polluted', 'foo*prototype'].forEach(path => {
          expect(() => set(obj, path, true, {delimiter: '*', mut: true, force: true})).toThrow(TypeError)
          expect(obj).toEqual({foo: {}})
        })
      })

      test('rejects before traversing getters or cloning', () => {
        const getter = jest.fn(() => ({}))
        const toJSON = jest.fn(() => ({}))
        const obj = {toJSON}
        Object.defineProperty(obj, 'foo', {get: getter, enumerable: true})

        ;[false, true].forEach(mut => {
          expect(() => set(obj, 'foo.__proto__.polluted', true, {mut, force: true})).toThrow(TypeError)
        })
        expect(getter).not.toHaveBeenCalled()
        expect(toJSON).not.toHaveBeenCalled()
      })

      ;[false, true].forEach(mut => {
        test(`validates the whole batch before any writes or cloning with mut=${mut}`, () => {
          const toJSON = jest.fn(() => ({foo: {}}))
          const obj = {foo: {}, toJSON}

          expect(() => set(obj, ['foo.safe', 'foo.__proto__.polluted'], [1, true], {mut, force: true})).toThrow(TypeError)
          expect(obj.foo).toEqual({})
          expect(toJSON).not.toHaveBeenCalled()
        })
      })

      test('normalizes nonstring keys before checking them', () => {
        const obj = {}
        const unsafeKeys = [
          ['__proto__'],
          {toString: () => '__proto__'},
          {[Symbol.toPrimitive]: () => '__proto__'},
          Object('prototype')
        ]

        unsafeKeys.forEach(key => {
          expect(() => set(obj, key, true, {mut: true})).toThrow(TypeError)
          expect(Object.getPrototypeOf(obj)).toBe(Object.prototype)
          expect(Object.keys(obj)).toEqual([])
        })
      })

      test('rejects unsafe boxed string paths', () => {
        ;[false, true].forEach(mut => {
          ;[false, true].forEach(force => {
            ;['__proto__.polluted', 'constructor.prototype.polluted'].forEach(path => {
              const obj = {}

              expect(() => set(obj, Object(path), true, {mut, force})).toThrow(TypeError)
              expect(obj).toEqual({})
              expect(Object.prototype.polluted).toBeUndefined()
            })
          })
        })
      })

      test('uses the checked property key without coercing it again', () => {
        const obj = {}
        let calls = 0
        const key = {toString: () => ++calls === 1 ? 'safe' : '__proto__'}

        expect(set(obj, key, 1, {mut: true})).toBe(obj)
        expect(obj.safe).toBe(1)
        expect(calls).toBe(1)
        expect(Object.getPrototypeOf(obj)).toBe(Object.prototype)
      })

      test('rejects inherited traversal before reading a getter', () => {
        const getter = jest.fn(() => ({}))
        const parent = {}
        Object.defineProperty(parent, 'shared', {get: getter})
        const obj = Object.create(parent)

        expect(() => set(obj, 'shared.polluted', true, {mut: true})).toThrow(TypeError)
        expect(getter).not.toHaveBeenCalled()
        expect(Object.keys(obj)).toEqual([])
      })

      test('does not traverse shared inherited functions', () => {
        const obj = {}

        expect(() => set(obj, 'toString.polluted', true, {mut: true})).toThrow(TypeError)
        expect(Object.prototype.toString.polluted).toBeUndefined()
        expect(obj).toEqual({})
      })

      test('force creates an own property instead of traversing an inherited object', () => {
        const shared = {}
        const obj = Object.create({shared})

        expect(set(obj, 'shared.safe', 1, {mut: true, force: true})).toBe(obj)
        expect(Object.prototype.hasOwnProperty.call(obj, 'shared')).toBe(true)
        expect(obj.shared).toEqual({safe: 1})
        expect(shared).toEqual({})
      })

      test('force shadows an inherited getter without calling it', () => {
        const getter = jest.fn(() => ({}))
        const parent = {}
        Object.defineProperty(parent, 'shared', {get: getter})
        const obj = Object.create(parent)

        set(obj, 'shared.safe', 1, {mut: true, force: true})
        expect(obj.shared).toEqual({safe: 1})
        expect(getter).not.toHaveBeenCalled()
      })
    })

    describe('ordinary property paths', () => {
      test('preserves boxed string nested paths', () => {
        const obj = {foo: {bar: 1}}

        expect(set(obj, Object('foo.bar'), 2)).toEqual({foo: {bar: 2}})
        expect(obj.foo.bar).toBe(1)
        expect(set(obj, Object('foo*bar'), 3, {delimiter: '*', mut: true})).toBe(obj)
        expect(obj.foo.bar).toBe(3)
      })

      test('allows a terminal constructor property', () => {
        const obj = {foo: {}}

        expect(set(obj, 'foo.constructor', 'value')).toEqual({foo: {constructor: 'value'}})
        expect(obj).toEqual({foo: {}})
        expect(set(obj, 'constructor', 'value', {mut: true})).toBe(obj)
        expect(Object.prototype.hasOwnProperty.call(obj, 'constructor')).toBe(true)
        expect(obj.constructor).toBe('value')
      })

      test('allows names containing reserved words', () => {
        expect(set({}, '__proto__safe.constructorName.prototypeValue', 1, {force: true})).toEqual({
          __proto__safe: {constructorName: {prototypeValue: 1}}
        })
      })

      test('preserves numeric and symbol property keys in mutating mode', () => {
        const symbol = Symbol('safe')
        const obj = {}

        set(obj, 0, 'number', {mut: true})
        set(obj, symbol, 'symbol', {mut: true})
        set(obj, {[Symbol.toPrimitive]: () => symbol}, 'coerced symbol', {mut: true})
        expect(obj[0]).toBe('number')
        expect(obj[symbol]).toBe('coerced symbol')
      })

      test('supports empty keys and nested arrays', () => {
        const obj = {items: [{value: 1}]}

        expect(set({}, undefined, 1)).toEqual({'': 1})
        expect(set(obj, 'items.0.value', 2)).toEqual({items: [{value: 2}]})
        expect(obj.items[0].value).toBe(1)
      })

      ;[false, true].forEach(mut => {
        test(`supports forced batch writes with a custom delimiter and mut=${mut}`, () => {
          const obj = {}
          const result = set(obj, ['foo*bar', 'foo*baz'], [1, 2], {delimiter: '*', force: true, mut})

          expect(result).toEqual({foo: {bar: 1, baz: 2}})
          expect(obj).toEqual(mut ? result : {})
          expect(result === obj).toBe(mut)
        })
      })

      test('still requires force to create missing levels', () => {
        expect(() => set({}, 'missing.value', 1)).toThrow(TypeError)
        expect(set({}, 'missing.value', 1, {force: true})).toEqual({missing: {value: 1}})
      })
    })
  })
})
