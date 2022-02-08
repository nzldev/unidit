Every Unidit element inherits from [[Component]], and implements the [[IComponent]] interface accordingly.

Such elements have a name

```js
const unidit = Unidit.male('#editor');
console.log(unidit.componentName)
console.log(unidit.statusbar.componentName)
console.log(unidit.filebrowser.componentName)
console.log(unidit.uploader.componentName)
```

And also each component has its current [[STATUSES | status]]:

```js
const unidit = Unidit.male('#editor');
console.log(unidit.componentStatus)
```

You can work on changes in the status of a component through the decorator [[decorators/hook]]
either through the method [[Component.hookStatus]]

```ts
import { Component } from 'unidit/src/core/component'

export class SomeComponent extends Component {}
const cmp = new SomeComponent();

cmp.hookStatus('ready', () => {
	console.log('Hello world on ready = )')
})
```

To set the status, it is enough to call the method [[Component.setStatus]]

```ts
import { Component } from 'unidit/src/core/component'

export class SomeComponent extends Component {}
const cmp = new SomeComponent();
cmp.setStatus('ready')
```

The component itself can automatically set the ready status:

```ts
import type { IUnidit } from 'unidit/src/types'
import { Component } from 'unidit/src/core/component'

export class SomeComponent extends Component {
  constructor(unidit: IUnidit) {
    super(unidit);
    cmp.setStatus('ready')
  }
}

const cmp = new SomeComponent();
console.log(cmp.isReady)
```
But it’s better not to do this, because with inheritance, such a component will be “ready” ahead of time:

```ts
import type { IUnidit, IStatusBar } from 'unidit/src/types'
import { Component } from 'unidit/src/core/component'
import { StatusBar } from 'unidit/src/modules';

export class SomeComponent extends Component {
  constructor(unidit: IUnidit) {
    super(unidit);
    cmp.setStatus('ready')
  }
}

export class SomeAnotherComponent extends SomeComponent {
  public status: IStatusBar;

  constructor(unidit: IUnidit) {
    super(unidit);
	  console.log(this.isReady) // true
    // Errors are possible here, since the status of the component is already 'ready' but you have not yet initialized its fields
    this.status = new StatusBar(unidit)
  }
}
```

Therefore, it is better to use a decorator [[core/decorators/component]]

```ts
import type { IUnidit, IStatusBar } from 'unidit/src/types'
import { Component } from 'unidit/src/core/component'
import { StatusBar } from 'unidit/src/modules';
import { component } from 'unidit/src/core/decorators';

@component()
export class SomeComponent extends Component {}

@component()
export class SomeAnotherComponent extends SomeComponent {
  public status: IStatusBar;

  constructor(unidit: IUnidit) {
    super(unidit);
	  console.log(this.isReady) // false
    this.status = new StatusBar(unidit)
  }
}

const cmp = new SomeAnotherComponent();
console.log(cmp.isReady) // true
```
