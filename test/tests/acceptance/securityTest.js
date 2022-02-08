/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

describe('Security test', () => {
	describe('XSS', () => {
		describe('From source', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getUnidit();
					editor.value =
						'<math><iframe></iframe></math><img src onerror=alert(document.cookie)/>';

					expect(sortAttributes(editor.value)).eq(
						'<p><math><iframe></iframe></math><img src=""></p>'
					);
				});
			});

			describe('Create JS link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getUnidit();

					editor.value =
						'<p><a href="javascript:alert(\'yo\');"></a></p>';

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="http://javascript:alert(\'yo\');"></a></p>'
					);
				});
			});
		});

		describe('Insert ready Node', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getUnidit();
					const img = document.createElement('img');
					img.setAttribute('onerror', 'alert(document.cookie);');
					img.setAttribute('src', '');

					editor.s.insertImage(img.cloneNode(true));
					editor.s.insertNode(img);

					expect(sortAttributes(editor.value)).eq(
						'<p><img src=""><img src=""></p>'
					);
				});
			});

			describe('Insert unsafe link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getUnidit();

					const a = document.createElement('a');
					a.setAttribute('href', 'javascript:alert(1111);');
					a.innerText = 'Unsafe link';
					editor.s.insertNode(a);

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="http://javascript:alert(1111);">Unsafe link</a></p>'
					);
				});
			});
		});

		describe('Insert HTML Snippet', () => {
			describe('Snippet HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getUnidit();
					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					editor.s.insertHTML(
						'<img src="" onerror=alert(document.cookie)/>'
					);

					expect(sortAttributes(editor.value)).eq(
						'<p>test<img src=""></p>'
					);
				});
			});

			describe('Insert unsafe link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getUnidit();
					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					editor.s.insertHTML(
						'<a href="javascript:alert(1111)">link</a>'
					);

					expect(sortAttributes(editor.value)).eq(
						'<p>test<a href="http://javascript:alert(1111)">link</a></p>'
					);
				});
			});
		});

		describe('Disable', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should not remove this unsafe attribute', () => {
					const editor = getUnidit({
						cleanHTML: {
							removeOnError: false
						}
					});
					editor.value =
						'<math><iframe></iframe></math><img src onerror="console.log(document.cookie);"/>';

					expect(sortAttributes(editor.value)).eq(
						'<p><math><iframe></iframe></math><img onerror="console.log(document.cookie);" src=""></p>'
					);
				});
			});

			describe('Create JS link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getUnidit({
						cleanHTML: {
							safeJavaScriptLink: false
						}
					});

					editor.value =
						'<p><a href="javascript:console.log(\'yo\');">test</a></p>';

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="javascript:console.log(\'yo\');">test</a></p>'
					);
				});
			});
		});
	});
});
