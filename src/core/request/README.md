The module is responsible for sending requests over the network:

```js
const ajax = new Unidit.modules.Ajax(unidit, {
	url: 'https://nazrul.dev'
});

ajax.send().then((resp) => console.log(resp.text()));
```

The second argument can be settings [[AjaxOptions]]
