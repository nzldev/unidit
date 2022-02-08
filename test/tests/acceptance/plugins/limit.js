/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Limit plugin', function () {
	describe('Keydown', function () {
		describe('On keydown when editor already full', function () {
			it('should deny insert any chars', function (done) {
				const editor = getUnidit({
					limitChars: 5,
					observer: {
						timeout: 5
					}
				});

				editor.value = '11111';
				editor.s.insertHTML('a');

				setTimeout(() => {
					expect(editor.value).equals('<p>11111</p>');
					done();
				}, 200);
			});

			describe('Stat plugin', function () {
				it('should show chars count', function (done) {
					const editor = getUnidit({
						limitChars: 5,
						observer: {
							timeout: 5
						}
					});

					editor.value = '1111';

					editor.s.insertHTML('a');
					editor.s.insertHTML('a');

					setTimeout(() => {
						expect(editor.value).equals('<p>a1111</p>');
						const chars = editor.statusbar.container.querySelector(
							'.unidit-status-bar__item'
						);
						expect(chars.textContent.trim()).equals('Chars: 5');
						done();
					}, 200);
				});

				describe('Prevent keypress', function () {
					it('should show chars count', function (done) {
						const editor = getUnidit({
							limitChars: 5,
							observer: {
								timeout: 5
							}
						});

						editor.value = '<p>1111</p>';

						const range = editor.s.createRange(true);

						range.setEndAfter(editor.editor.firstChild.firstChild);
						range.collapse(false);

						expect(simulateEvent('keydown', 'v', editor.editor)).is
							.true;

						editor.value = '<p>11111</p>';
						expect(simulateEvent('keydown', 'v', editor.editor)).is
							.false;

						setTimeout(() => {
							expect(editor.value).equals('<p>11111</p>');
							const chars =
								editor.statusbar.container.querySelector(
									'.unidit-status-bar__item'
								);
							expect(chars.textContent.trim()).equals('Chars: 5');
							done();
						}, 200);
					});
				});
			});
		});
	});

	describe('Paste', function () {
		describe('When editor already full', function () {
			it('should deny insert any chars', function (done) {
				const editor = getUnidit({
					limitChars: 5,
					observer: {
						timeout: 5
					}
				});

				editor.value = '11111';

				simulateEvent('paste', editor.editor, function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return 'a';
						}
					};
				});

				setTimeout(() => {
					expect(editor.value).equals('<p>11111</p>');
					done();
				}, 200);
			});
		});
	});

	describe('Limit words', function () {
		describe('Paste', function () {
			describe('When editor already full', function () {
				it('should deny insert any chars', function (done) {
					const editor = getUnidit({
						limitWords: 3,
						observer: {
							timeout: 5
						}
					});

					editor.value = '11111';

					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					const paste = function () {
						simulateEvent('paste', editor.editor, function (data) {
							data.clipboardData = {
								types: ['text/html'],
								getData: function () {
									return ' aaa';
								}
							};
						});
					};

					const timeout = () => {
						setTimeout(() => {
							expect(editor.value).equals('<p>11111 aaa</p>');
							done();
						}, 200);
					};

					paste();
					expect(editor.value).equals('<p>11111 aaa</p>');

					paste();
					expect(editor.value).equals('<p>11111 aaa</p>');

					paste();
					timeout();
				});
			});
		});
	});
});
