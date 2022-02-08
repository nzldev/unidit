# Unidit UI Popup

The module is used to create pop-up windows next to interface elements.

```js
import { Popup } from 'unidit/src/core/ui';

const popup = new Popup(unidit);
popup.setContent('Hello world').open(() => ({
	left: 100,
	top: 200
}));

popup.close();
```
