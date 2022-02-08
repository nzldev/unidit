Assistant functions are intended for small basic operations and are divided into subgroups.

For example, the [[helpers/string]] subgroup is designed to work with strings:
```js
Unidit.modules.Helpers.ucfirst('hello') // Hello
Unidit.modules.Helpers.camelCase('hello-world') // helloWorld
Unidit.modules.Helpers.trim('       hello-world  ') // hello-world
Unidit.modules.Helpers.kebabCase('helloWorld') // hello-world
```
And the [[helpers/html]] subgroup is designed to work with strings containing HTML:
```js
Unidit.modules.Helpers.nl2br('hello\nworld') // hello<br>world
```

> All helpers, regardless of the group, are in the namespace `Unidit.modules.Helpers`

The most commonly used helpers are checkers [[helpers/checker]]:

```js
Unidit.modules.Helpers.isBoolean('hello') // false

Unidit.modules.Helpers.isHtml('hello-world') // false
Unidit.modules.Helpers.isHtml('<p>hello world</p>') // true

Unidit.modules.Helpers.isInt('100') // true
Unidit.modules.Helpers.isInt('100.1') // false
Unidit.modules.Helpers.isInt('test') // false

Unidit.modules.Helpers.isFunction(() => {}) // true
Unidit.modules.Helpers.isString(123) // false
```
