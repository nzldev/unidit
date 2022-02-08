/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Focus test', () => {
	describe('Enable autofocus', () => {
		it('Should set focus inside editor after init', () => {
			const editor = getUnidit({
				autofocus: true,
				observer: {
					defaultTimeout: 0
				}
			});

			expect(editor.ew.getSelection().getRangeAt(0).startContainer).eq(
				editor.editor
			);
		});

		describe('Cursor position', () => {
			describe('By default', () => {
				it('Should set cursor after content', () => {
					const area = appendTestArea();

					area.value = '<p>test <span>text</span></p>';

					const editor = getUnidit(
						{
							autofocus: true,
							observer: {
								defaultTimeout: 0
							}
						},
						area
					);

					editor.s.insertHTML('pop');

					expect(editor.value).eq('<p>test <span>textpop</span></p>');
				});
			});

			describe('In the start', () => {
				it('Should set cursor before content', () => {
					const area = appendTestArea();

					area.value = '<p>test <span>text</span></p>';

					const editor = getUnidit(
						{
							autofocus: true,
							cursorAfterAutofocus: 'start',
							observer: {
								defaultTimeout: 0
							}
						},
						area
					);

					editor.s.insertHTML('pop');

					expect(editor.value).eq('<p>poptest <span>text</span></p>');
				});
			});
		});
	});

	describe('Save cursor position after blur', () => {
		describe('Enable', () => {
			it('Should append special markers on selection range', () => {
				const editor = getUnidit();
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);
				simulateEvent('blur', editor);

				expect(
					editor.editor.querySelectorAll(
						'span[data-unidit-selection_marker]'
					).length
				).eq(2);

				expect(
					sortAttributes(editor.getNativeEditorValue()).replace(
						/[0-9]+_[0-9]+/g,
						''
					)
				).eq(
					'<p>t' +
						'<span data-unidit-selection_marker="start" id="unidit-selection_marker_" style="display:none;line-height:0"></span>' +
						'es' +
						'<span data-unidit-selection_marker="end" id="unidit-selection_marker_" style="display:none;line-height:0"></span>' +
						't</p>'
				);
			});
		});

		describe('Disable', () => {
			it('Should not append special markers on selection range', () => {
				const editor = getUnidit({
					saveSelectionOnBlur: false
				});
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);
				simulateEvent('blur', editor);

				expect(
					editor.editor.querySelectorAll(
						'span[data-unidit-selection_marker]'
					).length
				).eq(0);
			});
		});
	});
});
