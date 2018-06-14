
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
- [Contribute](#contribute)
- [License](#License)

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). 

```sh
$ npm install set-nested-prop
$ # OR
$ yarn add set-nested-prop
```

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

const customObj = set(obj1, 'foo*bar*baz', 7, { sep: '*' })
console.log(customObj) // { foo: { bar: { baz: 7 } } }

const forceObj = {}
const forceObjResult = set(forceObj, 'foo.bar', 1, {force: true})
console.log(forceObjResult) // {foo: {bar: 1}}

```

## Contribute

1. Fork it and create your feature branch: git checkout -b my-new-feature
2. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature 
4. Submit a pull request

## License

MIT
    