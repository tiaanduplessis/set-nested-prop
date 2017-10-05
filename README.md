<h1 align="center">set-nested-prop</h1>
<div align="center">
  <strong>Set nested object property (supports custom seperator and mutation)</strong>
</div>
<br>
<div align="center">
  <a href="https://npmjs.org/package/set-nested-prop">
    <img src="https://img.shields.io/npm/v/set-nested-prop.svg?style=flat-square" alt="Package version" />
  </a>
  <a href="https://npmjs.org/package/set-nested-prop">
  <img src="https://img.shields.io/npm/dm/set-nested-prop.svg?style=flat-square" alt="Downloads" />
  </a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
  </a>
  <a href="https://travis-ci.org/tiaanduplessis/set-nested-prop">
    <img src="https://img.shields.io/travis/tiaanduplessis/set-nested-prop.svg?style=flat-square" alt="Travis Build" />
  </a>
	<a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square" alt="prettier code formatting" />
  </a>
  <a href="https://github.com/tiaanduplessis/set-nested-prop/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/set-nested-prop.svg?style=flat-square" alt="License" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs" />
  </a>
  <a href="https://www.paypal.me/tiaanduplessis/1">
    <img src="https://img.shields.io/badge/$-support-green.svg?style=flat-square" alt="Donate" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://github.com/tiaanduplessis/set-nested-prop/watchers">
    <img src="https://img.shields.io/github/watchers/tiaanduplessis/set-nested-prop.svg?style=social" alt="Github Watch Badge" />
  </a>
  <a href="https://github.com/tiaanduplessis/set-nested-prop/stargazers">
    <img src="https://img.shields.io/github/stars/tiaanduplessis/set-nested-prop.svg?style=social" alt="Github Star Badge" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20set-nested-prop!%20https://github.com/tiaanduplessis/set-nested-prop%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/tiaanduplessis/set-nested-prop.svg?style=social" alt="Tweet" />
  </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="https://github.com/tiaanduplessis">Tiaan</a> and <a href="https://github.com/tiaanduplessis/set-nested-prop/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## Install

[![Greenkeeper badge](https://badges.greenkeeper.io/tiaanduplessis/set-nested-prop.svg)](https://greenkeeper.io/)

```sh
$ npm install --save set-nested-prop
# OR
$ yarn add set-nested-prop
```

## Usage

```js

const set = require('set-nested-prop')

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

```


## Contribute

Contributions are welcome!

1. Fork it.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Or open up [a issue](https://github.com/tiaanduplessis/set-nested-prop/issues).

## License

Licensed under the MIT License.
