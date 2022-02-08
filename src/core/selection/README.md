A module for working with the cursor, text selections, processing selections, inserting html in place of the cursor.
most obvious use case

## How to insert HTML into Unidit

There is a family of methods for this.[[Select.prototype.insertHTML]], [[Select.prototype.insertNode]], [[Select.prototype.insertImage]].

```js
const unidit = Unidit.make('#editor');
unidit.selection.insertHTML('<span>some html</span>')
unidit.selection.insertNode(document.createElement('div')) // don't do that =) see [[core/create]]
unidit.selection.insertImage('https://somesite.com/image.png')
```

## How to set focus in Unidit editor

```js
const unidit = Unidit.make('#editor');
unidit.selection.focus()
```
