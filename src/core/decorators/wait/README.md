Wrap function in wait wrapper, it will be called after `condition` returns `true`

```typescript
import { component, wait } from 'unidit/src/core/decorators';
import { UIElement } from 'unidit/src/ui';

@component()
class UISomeElement extends UIElement {
	@wait(() => typeof jQuery !== 'undefined')
	protected runOnLoadJQuery(html: string): void {
		jQuery(this.container).html(html);
		alert('Run');
	}
}

const elm = new UISomeElement(unidit);
elm.runOnLoadJQuery('<h1>One</h1>'); // Do nothing
// jQuery is loaded
// alert
```
