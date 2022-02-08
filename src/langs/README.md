Unidit internationalization module.

In order for Unidit to show the interface in your language, you just need to enable it in the settings:

```js
Unidit.make('#editor', {
	language: 'ru'
});
```

List of available languages:

```
ar,
cs_cz,
de,
en,
es,
fr,
he,
hu,
id,
it,
ja,
ko,
nl,
pl,
pt_br,
ru,
tr,
zh_cn,
zh_tw
```

If you do not find your language, then you can create a language file yourself by [copying any of the other languages](https://github.com/nzldev/unidit/tree/master/src/langs)
After that just add its content like a field [[Unidit.langs]]

```js
// File './somepath/sml.js' - some language
Unidit.langs.sml = {
	'Type something': 'Scrivi qualcosa...',
	Advanced: 'Avanzato',
	'About Unidit': 'A proposito di Unidit',
	'Unidit Editor': 'Unidit Editor'
	// ...
};
```

And include this file after Unidit

```html
<script src="./node_modules/unidit/build/unidit.es2018.min.js"></script>
<script src="./somepath/sml.js"></script>
<script>
	Unidit.make('#editor', {
		language: 'sml'
	});
</script>
```

If you don't like how `Unidit` has translated one or another part of the app into your native language, you can either [make a Pull Request](https://github.com/nzldev/unidit/edit/master/src/langs/ar.js)
Or redefine the desired string combinations and translate them in your own way:

```js
Unidit.make('#editor', {
	language: 'ru',
	i18n: {
		ru: {
			'Type something': 'Введите что-либо тут...'
		}
	}
});
```

To use internationalization in your own plugin, use the method [[Unidit.i18n]]

```js
const editor = new Unidit('#redactor', {
	language: 'ru'
});
console.log(editor.i18n('Type something')); //'Введите что-либо тут...'
```

## UIElement

For convenience, if in the [[UIElement]] descendant in the `render` method, return a string in the format:
```
~Some text~
```
It will be automatically passed through [[Unidit.i18n]]

For example:

```js
class UIBox extends Unidit.modules.UIElement {
	render() {
		return `<div>
		    <div class="&__some-element">~Some text~</div>
		</div>`
  }
}

const editor = Unidit.make('#editor', {
  language: 'en',
  i18n: {
    en: {
      'Some text': 'Another text'
    }
  }
})
const box = new UIBox(editor);
console.log(box.container.outerHTML); //<div class="unidit-ui-box"><div class="unidit-ui-box__some-element">Another text</div></div>
```

It's the same as doing this:
```js
class UIBox extends Unidit.modules.UIElement {
	render() {
		return `<div>
		    <div class="&__some-element">${this.unidit.i18n('Some text')}</div>
		</div>`
  }
}
```
