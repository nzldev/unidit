![Unidit WYSIWYG editor](https://raw.githubusercontent.com/nzldev/unidit/master/examples/assets/logo.png)

# Unidit Editor 3

An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

[![Build Status](https://github.com/nzldev/unidit/workflows/Run%20tests/badge.svg)](https://github.com/nzldev/unidit/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/unidit.svg)](https://badge.fury.io/js/unidit)
[![npm](https://img.shields.io/npm/dm/unidit.svg)](https://www.npmjs.com/package/unidit)

-   [Demo and Official site](https://nazrul.dev/unidit/)
-   [PRO Version](https://nazrul.dev/unidit/pro/)
-   [Playground - play with options](https://nazrul.dev/unidit/play.html)
-   [Documentation](https://nazrul.dev/unidit/docs/)
-   [Download & Changes](https://github.com/nzldev/unidit/releases)
-   [Changelog](https://github.com/nzldev/unidit/blob/master/CHANGELOG.MD)
-   [Examples](https://xdan.github.io/unidit/examples/)

## Get Started

## How use

Download the latest [release](https://github.com/nzldev/unidit/releases/latest) or

### INSTALL VIA NPM

```bash
npm install unidit
```

or

```bash
yarn add unidit
```

### Include just two files

ES5 Version

```html
<link type="text/css" rel="stylesheet" href="build/unidit.min.css" />
<script type="text/javascript" src="build/unidit.min.js"></script>
```

ES2018 Version (if your users use only modern browsers)

```html
<link type="text/css" rel="stylesheet" href="build/unidit.es2018.min.css" />
<script type="text/javascript" src="build/unidit.es2018.min.js"></script>
```

### Use a CDN

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/unidit/3.11.2/unidit.es2018.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/unidit/3.11.2/unidit.es2018.min.js"></script>
```

### USAGE

And some `<textarea>` element

```html
<textarea id="editor" name="editor"></textarea>
```

After this, you can init Unidit plugin

```javascript
var editor = new Unidit('#editor');
editor.value = '<p>start</p>';
```

or

```javascript
const editor = Unidit.make('#editor');
editor.value = '<p>start</p>';
```

with jQuery

```javascript
$('textarea').each(function () {
	var editor = new Unidit(this);
	editor.value = '<p>start</p>';
});
```

## For contributors:

```bash
git clone https://github.com/nzldev/unidit.git
cd unidit
npm install
```

Run webpack Hot Reload server:

```bash
npm start
```

Demo will be available here

```
http://localhost:2000/
```

Build min files:

```bash
npm run build
```

Run tests:

```bash
karma start --browsers ChromeHeadless,IE,Firefox karma.conf.js
```

or

```bash
npm test
```

or

```bash
yarn test
```

For checking tests in browser, open URL:

```
http://localhost:2000/test/test.html
```

For testing FileBrowser and Uploader modules, need install [PHP Connector](https://github.com/nzldev/unidit-connectors)

```bash
composer create-project --no-dev unidit/connector
```

Run test PHP server

```bash
php -S localhost:8181 -t ./
```

and set options for Unidit:

```javascript
var editor = new Unidit('#editor', {
	uploader: {
		url: 'http://localhost:8181/index-test.php?action=fileUpload'
	},
	filebrowser: {
		ajax: {
			url: 'http://localhost:8181/index-test.php'
		}
	}
});
```

### Create plugin

```javascript
Unidit.plugins.yourplugin = function (editor) {
	editor.events.on('afterInit', function () {
		editor.s.insertHTMl('Text');
	});
};
```

### Add custom button

```javascript
var editor = new Unidit('.someselector', {
	extraButtons: [
		{
			name: 'insertDate',
			iconURL: 'http://nazrul.dev/pacakges/unidit/logo.png',
			exec: function (editor) {
				editor.s.insertHTML(new Date().toDateString());
			}
		}
	]
});
```

or

```javascript
var editor = new Unidit('.someselector', {
	buttons: ['bold', 'insertDate'],
	controls: {
		insertDate: {
			name: 'insertDate',
			iconURL: 'http://nazrul.dev/pacakges/unidit/logo.png',
			exec: function (editor) {
				editor.s.insertHTML(new Date().toDateString());
			}
		}
	}
});
```

button with plugin

```javascript
Unidit.plugins.add('insertText', function (editor) {
	editor.events.on('someEvent', function (text) {
		editor.s.insertHTMl('Hello ' + text);
	});
});

// or

Unidit.plugins.add('textLength', {
	init(editor) {
		const div = editor.create.div('unidit_div');
		editor.container.appendChild(div);
		editor.events.on('change.textLength', () => {
			div.innerText = editor.value.length;
		});
	},
	destruct(editor) {
		editor.events.off('change.textLength');
	}
});

// or use class

Unidit.plugins.add(
	'textLength',
	class textLength {
		init(editor) {
			const div = editor.create.div('unidit_div');
			editor.container.appendChild(div);
			editor.events.on('change.textLength', () => {
				div.innerText = editor.value.length;
			});
		}
		destruct(editor) {
			editor.events.off('change.textLength');
		}
	}
);

var editor = new Unidit('.someselector', {
	buttons: ['bold', 'insertText'],
	controls: {
		insertText: {
			iconURL: 'http://nazrul.dev/pacakges/unidit/logo.png',
			exec: function (editor) {
				editor.events.fire('someEvent', 'world!!!');
			}
		}
	}
});
```

## Browser Support

-   Internet Explorer 11
-   Latest Chrome
-   Latest Firefox
-   Latest Safari
-   Microsoft Edge

## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated. You can find Unidit on GitHub; feel free to start an issue or create a pull requests:
https://github.com/nzldev/unidit

## License

MIT
