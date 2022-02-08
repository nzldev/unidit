The module is designed to work with asynchronous operations inside the editor.

## Why

Unidit editor can be created, deleted and re-created. All asynchronous operations should be destroyed along with it.

If, for example, do this:

```js
const unidit = Unidit.make('#editor');
setTimeout(() => {
	unidit.e.on('change', () => console.log(unidit.value));
}, 1000);
unidit.destruct();
```

This kind of code will throw an error. At the moment the function is called, the editor will already be destructed.
You can independently monitor such operations.

For example like this:

```js
const timeout = setTimeout(() => {
	unidit.e.on('change', () => console.log(unidit.value));
}, 1000);
unidit.e.on('beforeDestroy', () => clearTimeout(timeout));
```

Then there will be no error. But such code is error-prone, and you can often forget about a process.
Therefore, the `Async` module was written. The module is intended for any kind of asynchronous operation in Unidit.
It keeps track of its handlers, and when the parent class (Unidit) is destroyed, it will clear all threads.

## Timeout/ClearTimeout

For example, the code above will work without problems like this:

```js
unidit.async.setTimeout(() => {
	unidit.e.on('change', () => console.log(unidit.value));
}, 1000);
unidit.destruct();
```

You can also clean up the execution of this handler yourself.

```js
const timeout = unidit.async.setTimeout(() => {}, 1000);
unidit.async.clearTimeout(timeout);
unidit.destruct();
```

But this is not necessary. When `unidit.destruct ()` is called, all asynchronous operations bound to this editor will be stopped.

## Promise

Another advantage of the module is working with promises. Promises, as well as times, can work out after the editor is destroyed.

```js
new Promise(result => {
	fetch('index.php').then(result);
}).then(data => {
	//here Unidit is already destroyed
	unidit.setEditorValue(data); // Error
});

unidit.destruct();
```

To prevent this from happening, it is better to do all operations with promises via async:

```js
unidit.async
	.promise(result => {
		fetch('index.php').then(result);
	})
	.then(data => {
		// This handler will no longer be executed
		unidit.setEditorValue(data);
	});

unidit.destruct();
```

## debounce/throttle

Two convenient methods for well-known operations:

```js
const a = unidit.async.debounce(() => {
	console.log('A');
}, 100);
a();
// timeout 50mc
a();
// timeout 50mc
a();
a();
// timeout 50mc
a();
a();
// timeout 50mc
a(); // A
a();
// timeout 150mc
a(); // A
```

The code will be executed only once if the calls occurred more often than 100ms.

```js
const b = unidit.async.throttle(() => {
	console.log('B');
}, 100);
a();
// timeout 50mc
a();
// timeout 50mc
a(); // B
a();
// timeout 50mc
a();
// timeout 50mc
a(); // B
```

The code will be executed once per 100ms. If the method is called 100 times in one second, then it will only execute 10 of them on its body.

## delay

The method allows you to interrupt the execution of the script for n ms

```js
async function Run() {
	console.log('A');
	await unidit.async.delay(1000); // 1 sec
	console.log('B');
}
```

## clear

You yourself can remove all asynchronous editor operations without waiting for destructuring:

```js
unidit.async.setTimeout(() => alert('Hello'), 1000);
unidit.async.clear();
```
