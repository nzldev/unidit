/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Unidit Editor Tests', function () {
	describe('Constructor', function () {
		it('Constructor Unidit must be in global scope', function () {
			expect(window.Unidit).is.a('function');
		});

		it('Constructor default should not be in global scope', function () {
			expect(window.default).is.not.a('function');
			expect(window.default).does.not.equal(window.Unidit);
		});

		describe('First argument', function () {
			describe('String #id', function () {
				it('Should be valid selector', function () {
					const area = appendTestArea('editor');

					const editor = new Unidit('#editor');
					expect(editor.element).equals(area);
					editor.destruct();
				});
			});

			describe('Undefined,null,false,bad seelctor,function,number, text node', function () {
				it('Should be not valid selector', function () {
					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(0);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit();
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(null);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(false);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit('.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit('>asdsad.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(function () {});
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(233);
					}).to.throw(Error);

					const elm = document.createTextNode('stop');
					expect(function () {
						// eslint-disable-next-line no-new
						new Unidit(elm);
					}).to.throw(Error);
				});
			});

			describe('HTMLTextAreaElement', function () {
				it('Should be instance of HTMLElement', function () {
					const area = appendTestArea('editor2');

					const editor2 = getUnidit(undefined, area);
					expect(editor2.element).equals(area);
					editor2.destruct();
				});
			});

			describe('HTMLDivElement', function () {
				it('Should be instance of HTMLElement', function () {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					document.body.appendChild(div);
					const editor3 = getUnidit(undefined, div);

					expect(editor3.element).equals(div);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());

					editor3.destruct();
					document.body.removeChild(div);
				});
			});

			describe('Found element', function () {
				it('Should be instance of HTMLElement', function () {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					div.setAttribute('id', 'test2222');
					document.body.appendChild(div);

					const found = document.getElementById('test2222');

					const editor3 = getUnidit(undefined, found);

					expect(editor3.element).equals(found);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());
					editor3.destruct();

					document.body.removeChild(div);
				});
			});
		});

		it('Editor should replace and hide source textarea', function () {
			const area = appendTestArea();

			const editor = getUnidit(undefined, area);
			expect(area.style.display).equals('none');

			if (!editor.options.iframe) {
				expect(editor.editor).equals(
					document.querySelector('.unidit-wysiwyg')
				);
			} else {
				expect(editor.editor).equals(editor.ed.body);
			}
		});

		describe('Source textarea', () => {
			it('should have component properties with Unidit instance', function () {
				const area = appendTestArea();

				const editor = getUnidit(undefined, area);
				expect(area.component).equals(editor);
			});

			describe('After destruct', () => {
				it('should not have component properties with Unidit instance', function () {
					const area = appendTestArea();

					const editor = getUnidit(undefined, area);
					editor.destruct();
					expect(area.component).is.null;
				});
			});
		});

		describe('Options', function () {
			it('Options should be inherited from the default values', function () {
				const editor = getUnidit({
					zIndex: 1986
				});

				expect(editor.options.zIndex).equals(1986);
				expect(editor.options.spellcheck).is.true;
			});

			describe('Set nested array', function () {
				it('Should create editor with merged default array and set array', function () {
					Unidit.defaultOptions.someArray = {
						data: [1, 2, 3, 4]
					};
					const editor = getUnidit({
						someArray: {
							data: [5, 6, 7]
						}
					});

					expect(editor.options.someArray.data.toString()).equals(
						'5,6,7,4'
					);
				});

				describe('Set nested array like Unidit.atom', function () {
					it('Should create editor with set array', function () {
						Unidit.defaultOptions.someArray = {
							data: [1, 2, 3, 4]
						};

						const editor = getUnidit({
							someArray: {
								data: Unidit.atom([5, 6, 7])
							}
						});

						expect(editor.options.someArray.data.toString()).equals(
							'5,6,7'
						);
					});
				});
			});

			describe('Set nested object', function () {
				it('Should create editor with merged default object and set object', function () {
					Unidit.defaultOptions.someObject = {
						data: {
							left: 10,
							right: 20
						}
					};

					const editor = getUnidit({
						someObject: {
							data: {
								top: 10,
								right: 10
							}
						}
					});

					expect(
						JSON.stringify(flatten(editor.options.someObject.data))
					).equals('{"top":10,"right":10,"left":10}');
				});

				describe('Set nested object like Unidit.atom', function () {
					it('Should create editor with set object', function () {
						Unidit.defaultOptions.someObject = {
							data: {
								left: 10,
								right: 20
							}
						};

						const editor = getUnidit({
							someObject: {
								data: Unidit.atom({
									top: 10,
									right: 10
								})
							}
						});

						expect(
							JSON.stringify(editor.options.someObject.data)
						).equals('{"top":10,"right":10}');
					});
				});
			});

			describe('Statusbar', function () {
				describe('Hide', function () {
					it('should not show statusbar', function () {
						const editor = getUnidit({
							statusbar: false
						});

						expect(
							editor.container
								.querySelector('.unidit-status-bar')
								.classList.contains('unidit_hidden')
						).is.true;

						expect(editor.statusbar.isShown).is.false;
					});

					describe('Show programmatically', function () {
						it('should show statusbar', function () {
							const editor = getUnidit({
								statusbar: false
							});

							expect(
								editor.container
									.querySelector('.unidit-status-bar')
									.classList.contains('unidit_hidden')
							).is.true;
							expect(editor.statusbar.isShown).is.false;

							editor.statusbar.show();

							expect(
								editor.container
									.querySelector('.unidit-status-bar')
									.classList.contains('unidit_hidden')
							).is.false;
							expect(editor.statusbar.isShown).is.true;
						});
					});
				});

				describe('Show', function () {
					it('should show statusbar', function () {
						const editor = getUnidit();

						expect(
							editor.container
								.querySelector('.unidit-status-bar')
								.classList.contains('unidit_hidden')
						).is.false;
						expect(editor.statusbar.isShown).is.true;
					});
				});
			});
		});

		describe('Set font for editor', function () {
			it('Should set the font-family of the editor by option', function () {
				const editor = getUnidit({
					style: {
						fontFamily: 'Arial'
					}
				});

				editor.value = '<some>test</some>';

				const style = window.getComputedStyle(editor.editor.firstChild);

				expect(style.fontFamily).equals('Arial');
			});
		});

		describe('Check preset', function () {
			it('Should set option by preset', function () {
				const editor2 = getUnidit();

				expect(editor2.options.inline).is.false;
				expect(editor2.options.toolbar).is.true;
				expect(editor2.options.readonly).is.false;

				const editor = getUnidit({
					preset: 'inline'
				});
				expect(editor.options.inline).is.true;
				expect(editor.options.toolbar).is.false;

				Unidit.defaultOptions.presets.custom = { readonly: true };
				const editor3 = getUnidit({
					preset: 'custom'
				});
				expect(editor3.options.readonly).is.true;

				const editor4 = getUnidit({
					preset: 'inline',
					inline: false
				});
				expect(editor4.options.inline).is.false;
				expect(editor4.options.toolbar).is.false;
			});
		});

		describe('Init in shadow root', function () {
			it('Should create all elements inside shadow root', function () {
				const app = appendTestDiv();
				app.attachShadow({ mode: 'open' });
				const root = app.shadowRoot;

				root.innerHTML = '<div id="edit"></div>';

				const editor = getUnidit(
					{
						globalFullSize: false,
						shadowRoot: root
					},
					root.getElementById('edit')
				);

				clickButton('brush', editor);

				const popup = getOpenedPopup(editor);

				expect(popup.parentNode.parentNode === root).is.true;
			});

			describe('Select element inside', function () {
				it('Should use Selection from shadow root', function () {
					const app = appendTestDiv();
					app.attachShadow({ mode: 'open' });
					const root = app.shadowRoot;

					root.innerHTML = '<div id="edit"></div>';

					const editor = getUnidit(
						{
							globalFullSize: false,
							shadowRoot: root
						},
						root.getElementById('edit')
					);

					editor.value = '<p>test</p>';
					editor.s.select(editor.editor.firstChild, true);
					replaceCursorToChar(editor);

					expect(editor.value).eq('<p>|test|</p>');
				});
			});
		});
	});

	describe('Editors stack', function () {
		it('Unidit.instances should contain all instances of Unidit', function () {
			const editor = getUnidit(
				undefined,
				appendTestArea('textarea_editor')
			);
			expect(Unidit.instances.textarea_editor).equals(editor);
		});

		it('Unidit.instances should not contain editor after destruct', function () {
			const editor = getUnidit(
				undefined,
				appendTestArea('textarea_editor')
			);
			editor.destruct();
			expect(Unidit.instances.textarea_editor).to.be.an('undefined');
		});
	});

	describe('Destructor', function () {
		it('After call "destruct" method, should return source textarea and remove Editor\'s stuf', function () {
			const area = appendTestArea();
			area.style.display = 'block';

			const editor = getUnidit(undefined, area);
			expect(area.style.display).equals('none');
			expect(editor.container.parentNode).equals(area.parentNode);
			editor.destruct();

			expect(area.style.display).equals('block');
			expect(editor.editor).equals(undefined);
		});

		it('After call "destruct" method, should return source textarea and remove all Editor\'s stuf', function () {
			const box = document.createElement('div'),
				area = document.createElement('textarea');

			box.appendChild(area);
			document.body.appendChild(box);

			const editor = getUnidit(undefined, area);
			editor.destruct();

			expect(box.innerHTML).equals('<textarea></textarea>');
			box.parentNode.removeChild(box);
		});
	});

	describe('Set/Get', function () {
		describe('Set value', function () {
			it('Set element value', function () {
				const area = appendTestArea();
				const editor = getUnidit(undefined, area);
				editor.setElementValue('<p>Test</p>');
				expect(area.value).equals('<p>Test</p>');
			});

			it('Set value by magic property', function () {
				const area = appendTestArea();
				const editor = getUnidit(undefined, area);
				editor.value = 'Test';

				expect(area.value).equals('<p>Test</p>');
				expect(editor.value).equals('<p>Test</p>');
			});
		});

		it('Set wrong element value', function () {
			const area = appendTestArea(),
				editor = getUnidit(undefined, area);

			expect(function () {
				editor.setElementValue(document.createTextNode('Test'));
			}).to.throw(/value must be/);
		});

		it('Set editor value', function () {
			const editor = getUnidit();

			editor.value = '<div>Test</div>';
			expect(editor.editor.innerHTML).equals('<div>Test</div>');
		});

		it('Set no string editor value', function () {
			const editor = getUnidit();

			expect(function () {
				editor.value = document.createElement('div');
			}).to.throw(/value must be/);
		});

		it('Set wrong editor value', function () {
			const editor = getUnidit();

			editor.value = '<div>Test<div>';
			expect(editor.editor.innerHTML).equals(
				'<div>Test<div></div></div>'
			);
		});

		describe('Synchronization', function () {
			it('Check synchronization between element and editor', function () {
				const editor = getUnidit();
				editor.value = '<div>Test<div>';

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);

				expect(editor.getElementValue()).equals(
					'<div>Test<div></div></div>'
				);
			});

			it('Check synchronization between editor and element', function () {
				const area = appendTestArea();
				const editor = getUnidit(undefined, area);
				area.value = '<div>Test</div>';
				editor.setElementValue();
				expect(editor.value).equals('<div>Test</div>');
			});

			it('Check synchronization between editor and element with wrong html', function () {
				const editor = getUnidit();
				editor.setElementValue('<div>Test</div>');
				expect(editor.value).equals(editor.getElementValue());
			});

			it('Check synchronization between editor and element when was pressed button', function () {
				const editor = getUnidit();
				editor.setElementValue('<div>Test</div>');
				expect(editor.value).equals(editor.getElementValue());

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);

				simulateEvent('keydown', Unidit.KEY_ENTER, editor.editor);
				expect(editor.value).equals(editor.getElementValue());
			});
		});

		describe('Save selection stuf', function () {
			describe('Set false in getEditorValue method', function () {
				it('Should return HTML with selections markers', function () {
					const editor = getUnidit();
					editor.value = 'test';
					editor.s.setCursorAfter(editor.editor.firstChild);
					editor.s.save(); // add selection markers
					expect(
						/<span[^>]+id="unidit-selection_marker_[^>]+><\/span>/.test(
							editor.getEditorValue(false)
						)
					).is.true;
					expect(
						/<span[^>]+id="unidit-selection_marker_[^>]+><\/span>/.test(
							editor.getEditorValue(true)
						)
					).is.false;
				});
			});
		});

		describe('Change returning value', function () {
			describe('Event "beforeGetValueFromEditor"', function () {
				it('Should restore &gt; to normal value in Liquid expressions', function () {
					const editor = getUnidit();
					editor.value = 'test {% if a > b %} stop {% if a < b %}';
					expect(editor.value).equals(
						'<p>test {% if a &gt; b %} stop {% if a &lt; b %}</p>'
					);

					editor.events.on('beforeGetValueFromEditor', function () {
						return editor
							.getNativeEditorValue()
							.replace(/{%[^}]+%}/g, function (match) {
								return match
									.replace(/&gt;/g, '>')
									.replace(/&lt;/g, '<');
							});
					});

					expect(editor.value).equals(
						'<p>test {% if a > b %} stop {% if a < b %}</p>'
					);
				});
			});

			describe('Event "beforeSetValueToEditor"', function () {
				it('Should be fired before set editor value', function () {
					const editor = getUnidit();
					editor.value = 'test';
					expect(editor.value).equals('<p>test</p>');

					editor.events.on(
						'beforeSetValueToEditor',
						function (old_value) {
							return old_value + ' stop';
						}
					);

					editor.value = 'test';

					expect(editor.value).equals('<p>test stop</p>');

					editor.events.on('beforeSetValueToEditor', function () {
						return false;
					});

					editor.value = 'uuups';

					expect(editor.value).equals('<p>test stop</p>');
				});
			});
		});

		describe('Check Cache decorator', function () {
			describe('Get filebrowser and uploader property from editor', function () {
				describe('FileBrowser', function () {
					it('should create instance of Filebrowser  only one time and in lazy mode', function () {
						const editor = getUnidit();

						editor.components.forEach(function (cmp) {
							expect(
								cmp instanceof Unidit.modules.FileBrowser
							).is.false;
						});

						const filebrowser = editor.filebrowser;
						expect(filebrowser instanceof Unidit.modules.FileBrowser)
							.is.true;

						let instanceCount = 0;

						editor.components.forEach(function (cmp) {
							if (cmp instanceof Unidit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const filebrowser2 = editor.filebrowser;
						editor.components.forEach(function (cmp) {
							if (cmp instanceof Unidit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(2);
						expect(filebrowser2 === filebrowser).is.true;
					});
				});

				describe('Uploader', function () {
					it('should create instance of Uploader  only one time and in lazy mode', function () {
						const editor = getUnidit();
						editor.components.forEach(function (cmp) {
							expect(
								cmp instanceof Unidit.modules.Uploader
							).is.false;
						});

						const uploader = editor.uploader;
						expect(uploader instanceof Unidit.modules.Uploader).is
							.true;

						let instanceCount = 0;

						editor.components.forEach(function (cmp) {
							if (cmp instanceof Unidit.modules.Uploader) {
								instanceCount += 1;
								expect(uploader === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const uploader2 = editor.uploader;

						editor.components.forEach(function (cmp) {
							if (cmp instanceof Unidit.modules.Uploader) {
								instanceCount += 1;
								expect(uploader === cmp).is.true;
							}
						});

						expect(instanceCount).equals(2);
						expect(uploader2 === uploader).is.true;
					});
				});
			});
		});
	});

	describe('Selection module', function () {
		it('Current selection element should be inside editor', function () {
			const editor = getUnidit(),
				div = document.createElement('div');

			document.body.appendChild(div);
			div.innerHTML = 'jingl';

			const sel = window.getSelection(),
				range = document.createRange();

			range.selectNodeContents(div);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			expect(editor.s.current()).is.null;
			div.parentNode.removeChild(div);
		});

		it('Current selection element', function () {
			const editor = getUnidit(),
				div = editor.ed.createElement('div'),
				text = editor.createInside.text('jingl');

			editor.value = '';
			div.appendChild(text);
			editor.s.insertNode(div);
			editor.s.setCursorIn(text);

			expect(editor.s.current()).equals(text);
		});

		it('Insert simple text node in editor', function () {
			const area = appendTestArea();
			const editor = new Unidit(area);
			editor.s.insertNode(editor.createInside.text('Test'));
			expect(editor.value).equals('<p>Test</p>');
			editor.destruct();
		});

		it('Insert 3 divs', function () {
			const editor = getUnidit();

			function insert(digit) {
				const div = editor.ed.createElement('div');

				div.innerHTML = digit;
				editor.s.insertNode(div);
			}

			insert(1);
			insert(2);
			insert(3);

			expect(editor.value).equals('<div>1</div><div>2</div><div>3</div>');
			editor.destruct();
		});

		it('Insert wrong data', function () {
			const editor = getUnidit();

			expect(function () {
				editor.s.insertNode();
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode('Text');
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode(null);
			}).to.throw(/node must be/);

			editor.destruct();
		});

		it('Select all and delete. Check plugin "backspace"', function () {
			const editor = getUnidit();
			editor.value = '<p>asdasd</p><p>asdasd</p><p>asd</p>';
			editor.execCommand('selectall');
			editor.execCommand('delete');
			expect(editor.value).equals('');
			editor.destruct();
		});

		describe('Editor after focus and after blur', function () {
			it('Should change editorIsActive field', function () {
				const input = document.createElement('input'),
					p = document.createElement('p'),
					editor = getUnidit();

				editor.s.focus({
					preventScroll: false
				});

				input.type = 'input';
				document.body.appendChild(input);

				p.textContent = 'Hi';
				document.body.appendChild(p);

				editor.value = '<p>Hello world</p>';
				editor.s.focus();
				editor.s.setCursorAfter(editor.editor.firstChild);

				expect(editor.editorIsActive).is.true;

				input.focus();
				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(input);

				editor.s.focus();
				simulateEvent('focus', editor.editor);
				editor.s.setCursorAfter(editor.editor.firstChild);
				expect(editor.editorIsActive).is.true;

				const range = editor.s.createRange(true);

				range.selectNodeContents(p);

				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(p);
			});
		});

		describe('Cursor position', function () {
			it('Should set cursor after node', function () {
				const editor = getUnidit({
					cleanHTML: {
						removeEmptyElements: false
					}
				});

				editor.value = '<p></p>';
				editor.s.setCursorIn(editor.editor.firstChild);

				const spans = [
					editor.ed.createElement('span'),
					editor.ed.createElement('span'),
					editor.ed.createElement('span')
				];

				editor.s.insertNode(spans[0]);
				editor.s.insertNode(spans[1]);
				editor.s.insertNode(spans[2]);

				editor.s.setCursorAfter(spans[1]);
				editor.s.insertNode(editor.ed.createElement('em'));

				expect(editor.value).equals(
					'<p><span></span><span></span><em></em><span></span></p>'
				);
			});

			it('Set cursor in non placed element', function () {
				const editor = getUnidit();

				expect(function () {
					const div = editor.ed.createElement('div');
					editor.s.setCursorIn(div);
				}).to.Throw(/in editor/);
			});
		});
	});

	describe('Readiness', () => {
		describe('Method waitForReady', () => {
			describe('Sync init', () => {
				it('Should return resolved promise', done => {
					const unidit = getUnidit();

					expect(unidit.isReady).is.true;

					unidit.waitForReady().then(j => {
						expect(unidit).eq(j);
						expect(unidit.isReady).is.true;
						done();
					});
				});
			});

			describe('Async init', () => {
				it('Should return resolved promise', done => {
					unmockPromise();
					const unidit = getUnidit({
						events: {
							createEditor: () => delay(100)
						}
					});

					expect(unidit.isReady).is.false;

					unidit.waitForReady().then(j => {
						expect(unidit).eq(j);
						expect(unidit.isReady).is.true;
						done();
					});
				});
			});
		});
	});
});
