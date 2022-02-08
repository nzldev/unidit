/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Placeholder plugin', function () {
	describe('After init on empty textarea', function () {
		it('Should show placeholder', function () {
			const area = appendTestArea();

			area.value = '';

			const editor = new Unidit(area);

			expect(
				editor.container.querySelectorAll('.unidit-placeholder')
					.length &&
					editor.container.querySelector('.unidit-placeholder').style
						.display === 'block'
			).is.true;
		});
	});

	describe('After init on not empty textarea', function () {
		it('Should hide placeholder', function () {
			const area = appendTestArea();
			area.value = '111';
			const editor = new Unidit(area);
			expect(
				!editor.container.querySelectorAll('.unidit-placeholder').length
			).is.true;
		});

		describe('Empty P', function () {
			it('Should show placeholder', function () {
				const area = appendTestArea();
				area.value = '<p><br></p>';
				const editor = new Unidit(area);

				expect(editor.container.querySelector('.unidit-placeholder')).is
					.not.null;
			});
		});

		describe('Empty UL/LI', function () {
			it('Should not show placeholder', function () {
				const area = appendTestArea();
				area.value = '<ul><li><br></li></ul>';
				const editor = new Unidit(area);

				expect(editor.container.querySelector('.unidit-placeholder')).is
					.null;
			});
		});
	});

	describe('Add text inside editor', function () {
		it('should show placeholder', function () {
			const area = appendTestArea();
			const editor = new Unidit(area);

			editor.value = '';

			expect(
				editor.container.querySelectorAll('.unidit-placeholder')
					.length &&
					editor.container.querySelector('.unidit-placeholder').style
						.display === 'block'
			).is.true;

			editor.s.insertNode(editor.createInside.text('test'));

			expect(
				!editor.container.querySelectorAll('.unidit-placeholder').length
			).is.true;
		});
	});

	describe('For element with fontsize 12px', function () {
		it("Should set Placeholder's fontsize", function () {
			const area = appendTestArea();
			const editor = new Unidit(area);

			editor.editor.style.fontSize = '12px';
			simulateEvent('keydown', Unidit.KEY_BACKSPACE, editor.editor);
			expect(
				editor.container.querySelectorAll('.unidit-placeholder')
					.length &&
					editor.container.querySelector('.unidit-placeholder').style
						.fontSize === '12px'
			).is.true;
		});
	});

	describe('For different align', function () {
		it("Should set Placeholder's text-align", function () {
			const editor = getUnidit();

			editor.value = '<p>|<br></p>';
			setCursorToChar(editor);

			clickTrigger('left', editor);
			const list = getOpenedPopup(editor);
			clickButton('right', list);

			const placeholder = editor.container.querySelector(
				'[data-ref="placeholder"]'
			);

			expect(placeholder.style.textAlign === 'right').is.true;

			clickTrigger('left', editor);
			const list2 = getOpenedPopup(editor);
			clickButton('center', list2);

			expect(placeholder.style.textAlign === 'center').is.true;
		});
	});

	describe('ReadOnly', function () {
		it('Should hide placeholder', function () {
			const table_editor_interface = appendTestArea();
			table_editor_interface.value = '';

			const editor = new Unidit(table_editor_interface, {
				readonly: true
			});

			expect(
				!editor.container.querySelectorAll('.unidit-placeholder').length
			).is.true;
			editor.value = 'test';
			expect(
				!editor.container.querySelectorAll('.unidit-placeholder').length
			).is.true;
		});
	});
});
