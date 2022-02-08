The Unidit editor consists of modules and plugins. Modules make up the permanent basis of the editor's work,
and plugins can add their own functionality [[plugin]].

The editor is initialized on a DOM element. It must already exist on the page:

```js
Unidit.make('#editor');
```
You can also set a DOM element right away.

```js
const elm = document.querySelector('#editor');
Unidit.make(elm);
```

The [[Unidit.make]] method returns an instance of [[Unidit]].

```js
const unidit = Unidit.make('#editor');
console.log(unidit.isReady)
```

This is almost equivalent to

```js
const unidit = new Unidit('#editor');
console.log(unidit.isReady)
```

> But the `make` method is preferable.

All customization of the editor is done through the [[Config]]:

```js
Unidit.make('#editor', {
	height: 300
});
```

Unidit instance has a module [[EventEmitter]]

```js
const unidit = Unidit.make('#editor');
unidit.events.on('keydown', (e) => {
	console.log(e.key)
})
```

And the [[Select]] module, which allows you to manipulate the content of the editor through HTML insertion

```js
const unidit = Unidit.make('#editor');
unidit.s.focus()
unidit.s.insertHTML('<p>test</p>')
```
