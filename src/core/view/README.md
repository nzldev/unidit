Unidit components [[Component]] require the parent component [[IUnidit]], or [[IViewBased]] to work.
But Unidit itself is also a component. And for its initialization it only needs options.

Also [[Dialog]], it does not need a Unidit instance to run.
You can display the dialog independently of the editor.

```js
const dialog = new Unidit.module.Dialog();
dialog.setContent('Hello world!');
dialog.open();
```

Thus, if you need a component that has its own event system, its own [[Async]] module, then you must inherit from [[View]].

```js
import { component } from 'unidit/src/core/decorators';
import { View } from 'unidit/src/core/view';

@component()
class YourComponent extends View {}

const elm = new YourComponent();
elm.events.on('someEvent', () => alert('Yo'));
```
