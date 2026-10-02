const fs = require('fs')
const path = require('path')
const vm = require('vm')
const {execFileSync} = require('child_process')

test('UMD works in a browser global without CommonJS or AMD', () => {
  const context = vm.createContext({})
  const code = fs.readFileSync(path.join(__dirname, 'dist/set-nested-prop.umd.js'), 'utf8')
  vm.runInContext(code, context)

  expect(typeof context.setNestedProp).toBe('function')
  expect(vm.runInContext(`
    (() => {
      const obj = {}
      const set = setNestedProp
      for (const mut of [false, true]) {
        for (const force of [false, true]) {
          for (const key of ['__proto__.polluted', 'constructor.prototype.polluted']) {
            let rejected = false
            try { set(obj, key, true, {mut, force}) } catch (error) {
              rejected = error instanceof TypeError
            }
            if (!rejected || Object.keys(obj).length || ({}).polluted !== undefined) return false
          }
        }
      }
      const result = set(obj, 'a*b', 1, {delimiter: '*', force: true})
      return result.a.b === 1 && Object.keys(obj).length === 0
    })()
  `, context)).toBe(true)
})

test('source and ES module distribution load natively without Babel', () => {
  const script = `
    import assert from 'node:assert/strict'
    import fs from 'node:fs'
    for (const file of ['src/index.js', 'dist/set-nested-prop.m.js']) {
      const code = fs.readFileSync(file, 'utf8')
      const {default: set} = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
      for (const mut of [false, true]) {
        for (const force of [false, true]) {
          const obj = {safe: {}}
          for (const key of ['__proto__.polluted', 'constructor.prototype.polluted']) {
            assert.throws(() => set(obj, key, true, {mut, force}), TypeError)
            assert.equal(({}).polluted, undefined)
            assert.deepEqual(obj, {safe: {}})
          }
          assert.throws(() => set(obj, ['safe.value', '__proto__.polluted'], [1, true], {mut, force}), TypeError)
          assert.deepEqual(obj, {safe: {}})
        }
      }
      assert.deepEqual(set({}, 'a*b', 1, {delimiter: '*', force: true}), {a: {b: 1}})
      const symbol = Symbol('safe')
      const obj = {}
      set(obj, {[Symbol.toPrimitive]: () => symbol}, 1, {mut: true})
      assert.equal(obj[symbol], 1)
    }
  `

  expect(() => execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: __dirname,
    timeout: 10000,
    stdio: 'pipe'
  })).not.toThrow()
})

test('each source map embeds the current source', () => {
  const source = fs.readFileSync(path.join(__dirname, 'src/index.js'), 'utf8')

  ;['js', 'm.js', 'umd.js'].forEach(extension => {
    const filename = `set-nested-prop.${extension}`
    const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', `${filename}.map`), 'utf8'))
    expect(map.version).toBe(3)
    expect(map.file).toBe(filename)
    expect(map.sources).toEqual(['../src/index.js'])
    expect(map.sourcesContent).toEqual([source])
    expect(map.mappings.length).toBeGreaterThan(0)
  })
})
