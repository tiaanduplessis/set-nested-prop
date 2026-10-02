
# set-nested-prop
[![package version](https://img.shields.io/npm/v/set-nested-prop.svg?style=flat-square)](https://npmjs.org/package/set-nested-prop)
[![package downloads](https://img.shields.io/npm/dm/set-nested-prop.svg?style=flat-square)](https://npmjs.org/package/set-nested-prop)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/set-nested-prop.svg?style=flat-square)](https://npmjs.org/package/set-nested-prop)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Set nested object property (supports custom seperator, mutation, forcing creation & multi set)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Safe property paths](#safe-property-paths)
- [Contribute](#contribute)
- [License](#License)

## Install

The npm releases `2.0.1` and `2.0.2` are [known malicious packages](https://osv.dev/vulnerability/MAL-2025-191010). Do not install those releases. The prototype pollution fix in this repository has not been published to npm; use reviewed repository source and the validation steps below.

## Usage

```js
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

const customObj = set(obj1, 'foo*bar*baz', 7, { delimiter: '*' })
console.log(customObj) // { foo: { bar: { baz: 7 } } }

const forceObj = {}
const forceObjResult = set(forceObj, 'foo.bar', 1, {force: true})
console.log(forceObjResult) // {foo: {bar: 1}}

```

## Safe property paths

Paths containing `__proto__` or `prototype` segments, or a `constructor` segment followed by another segment, throw a `TypeError`. This applies to custom delimiters, coerced nonstring property keys, and both mutating and nonmutating calls. A terminal `constructor` property remains supported, for example `set(obj, 'settings.constructor', value)`.

All paths in a batch are checked before cloning the input, reading its properties, or applying any writes. If any path contains a forbidden segment, the entire batch is rejected without changes to the input. These checks also reject ordinary own properties named `__proto__` or `prototype`.

Intermediate properties must belong to the object being traversed. Without `force`, an inherited intermediate property throws a `TypeError` before it is read. With `force`, a fresh own object is created instead of traversing the inherited value. Existing behavior for ordinary missing or invalid intermediate values still applies; a batch is not a transaction for those errors.

## Contribute

Use Node `22.23.3` and Yarn `1.22.22`. Install only the committed dependency lockfile and disable dependency lifecycle scripts:

```sh
yarn install --frozen-lockfile --ignore-scripts --ignore-engines
npm run check
npm run coverage
git diff --exit-code -- dist
```

`npm run check` lints without changing files, rebuilds all distributions, and runs the same regression suite against the source and each distribution. Commit regenerated distributions and source maps when changing the source. There are no TypeScript declarations or type-checking configuration in this project.

1. Fork it and create your feature branch: git checkout -b my-new-feature
2. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature
4. Submit a pull request

## License

MIT
