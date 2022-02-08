/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Dialog system tests', function () {
	describe('About dialog', function () {
		it('Should be opened when use clicks on the About button', function () {
			getBox().style.width = '100%';

			const editor = getUnidit({
				disablePlugins: 'mobile'
			});

			const about = getButton('about', editor);
			expect(about).is.not.null;

			simulateEvent('click', 0, about);

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;

			expect(dialog.innerHTML.indexOf('nazrul.dev') !== -1).is.true;
		});

		describe('Close About dialog', function () {
			it('Should show Close button in right top corner and close dialog after click', function () {
				getBox().style.width = '100%';
				const editor = getUnidit({
					disablePlugins: 'mobile'
				});

				const about = getButton('about', editor);
				expect(about).is.not.null;

				simulateEvent('click', 0, about);

				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;

				expect(dialog.innerHTML.indexOf('nazrul.dev') !== -1).is.true;

				const close = getButton('close', dialog);
				expect(close).is.not.null;

				simulateEvent('click', 0, close);

				expect(getOpenedDialog(editor)).is.null;

				expect(dialog.parentElement).is.null;
			});
		});
	});

	describe('Popup inside dialog', function () {
		it('Should be opened under dialog', function () {
			getBox().style.width = '100%';

			const editor = getUnidit({
				filebrowser: {
					ajax: {
						url: 'https://nazrul.dev/unidit/connector/index.php'
					}
				}
			});
			editor.value = '<img alt="" src="../artio.jpg"/>';
			editor.s.focus();

			simulateEvent('click', editor.editor.querySelector('img'));

			const popup = getOpenedPopup(editor);

			clickButton('pencil', popup);

			const dialog = getOpenedDialog(editor);
			const changeImage = dialog.querySelector(
				'a[data-ref="changeImage"]'
			);
			expect(changeImage).is.not.null;

			simulateEvent('click', changeImage);

			const popup2 = getOpenedPopup(editor);
			expect(popup2).is.not.null;

			const pos = Unidit.modules.Helpers.position(popup2),
				elm = document.elementFromPoint(pos.left + 20, pos.top + 20);

			expect(Unidit.modules.Dom.isOrContains(popup2, elm)).is.true;
		});
	});

	describe('Short Unidit.Alert etc static methods', function () {
		it('Should work without Unidit instance', function () {
			const dialog = Unidit.Alert('Hello');
			dialog.close();
		});

		it('Should return Dialog instance', function () {
			const dialog = Unidit.Alert('Hello');
			expect(dialog instanceof Unidit.modules.Dialog).is.true;
			dialog.close();
		});

		describe('Show not string', function () {
			it('Should show dialog with toString value', function () {
				const dialog = Unidit.Alert(111);
				expect(
					dialog.dialog.querySelector('.unidit-dialog__content')
						.textContent
				).equals('111');
				dialog.close();
			});
		});
		it('Should get string or HTMLElement or array of string or array of HTMLElement in arguments', function () {
			const dialog = Unidit.Alert(['<div id="hello1">Hello</div>']);
			expect(document.getElementById('hello1')).is.not.null;
			dialog.close();

			const dialog2 = Unidit.Alert(document.createTextNode('Test'));
			expect(dialog2 instanceof Unidit.modules.Dialog).is.true;
			dialog2.close();

			const div = document.createElement('div');
			div.id = 'hello3';
			const dialog3 = Unidit.Alert(div);
			expect(div).equals(document.getElementById('hello3'));
			dialog3.close();
		});
	});

	describe('Dialog image', function () {
		describe('Opened dialog image', function () {
			it('Should disable margin inputs for left, bottom, right if element has equals margins(margin:10px;)', function () {
				const editor = getUnidit({
					observer: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value =
					'<img src="https://nazrul.dev/unidit/build/images/artio.jpg" style="margin:10px;border:1px solid red;width:100px;height:100px;"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);

				const dialog = getOpenedDialog(editor);

				expect(dialog.style.display).does.not.equal('none');
				expect(
					dialog.querySelectorAll(
						'[data-ref="marginBottom"][disabled]'
					).length
				).equals(1);
			});

			it('Should enable margin inputs for left, bottom, right if element has not equals margins(margin:10px 5px;)', function () {
				const editor = getUnidit({
					observer: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value =
					'<img src="https://nazrul.dev/unidit/build/images/artio.jpg" style="margin:10px 5px;border:1px solid red;width:100px;height:100px;"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);

				const dialog = getOpenedDialog(editor);

				expect(dialog.style.display).does.not.equal('none');
				expect(
					dialog.querySelectorAll(
						'[data-ref="marginBottom"][disabled]'
					).length
				).equals(0);
			});
		});
	});
});
