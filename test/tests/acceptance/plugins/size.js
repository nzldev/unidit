/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Test editor size plugin', function () {
	it('should show resize handler in right-bottom corner and allow resize editor by vertical', function () {
		const editor = getUnidit({
			height: 300,
			iframe: true
		});

		expect(
			editor.container.querySelectorAll('.unidit-editor__resize').length
		).equals(1);
	});

	describe('Sizes', function () {
		describe('Set calc expression as height', function () {
			it('Should set editor height by option', function () {
				getBox().style.height = '400px';

				const editor = getUnidit({
					height: 'calc(100% - 20px)'
				});

				editor.value = '<p>test</p>'.repeat(100);
				expect(editor.container.offsetHeight).equals(380);
			});
		});

		describe('Set fixed height', function () {
			it('Should set editor height by option', function () {
				const area = appendTestArea();
				const editor = new Unidit(area, {
					height: 300
				});

				editor.value = '<p>test</p>'.repeat(100);

				expect(editor.container.offsetHeight).equals(300);
			});

			it('Should set editor height by option for iframe', function () {
				const editor = getUnidit({
					height: 300,
					iframe: true
				});

				editor.value = '<p>test</p>'.repeat(100);
				expect(editor.container.offsetHeight).equals(300);
			});

			it('Should not change size by content after window was resized', function () {
				const editor = getUnidit({
					height: 300
				});

				editor.value = '<p>test</p>'.repeat(20);
				expect(editor.container.offsetHeight).equals(300);

				simulateEvent('resize', 0, window);
				expect(editor.container.offsetHeight).equals(300);
			});

			describe('Fullsize mode', function () {
				it("Should set heights of workplace to 100% - toolbar's height", function () {
					const editor = getUnidit({
						fullsize: true
					});

					expect(editor.workplace.offsetHeight).to.be.above(300);
				});

				it('Should restore size after fullsized mode', function () {
					const editor = getUnidit({
						height: 300
					});

					editor.value = '<p>test</p>'.repeat(20);
					expect(editor.container.offsetHeight).equals(300);

					editor.toggleFullSize(true);
					expect(editor.container.offsetHeight).to.be.above(300);

					editor.toggleFullSize(false);
					expect(editor.container.offsetHeight).equals(300);
					expect(editor.container.offsetWidth).to.be.above(300);
				});

				it('Should hide resizer', function () {
					const editor = getUnidit({
						height: 300,
						iframe: true
					});

					const handle = editor.container.querySelector(
						'.unidit-editor__resize'
					);

					expect(handle).is.not.null;
					editor.toggleFullSize(true);

					expect(
						editor.ownerWindow.getComputedStyle(handle).display
					).equals('none');
				});

				it('Should change the icon in toolbar', function () {
					const editor = getUnidit();
					const button = getButton('fullsize', editor);
					expect(button).is.not.null;

					expect(button.querySelector('svg')).is.not.null;

					const old_icon = button.querySelector('svg').innerHTML;

					editor.toggleFullSize(true);
					expect(
						button.querySelector('svg').innerHTML
					).does.not.equal(old_icon);

					editor.toggleFullSize(false);
					expect(button.querySelector('svg').innerHTML).equals(
						old_icon
					);
				});

				describe('For text icons', function () {
					it('Should change the text in toolbar', function () {
						const editor = getUnidit({
							textIcons: true
						});

						const button = getButton('fullsize', editor);

						expect(button).is.not.null;
						expect(button.querySelector('svg')).is.null;

						const old_icon = button.textContent;

						editor.toggleFullSize(true);
						expect(button.textContent).does.not.equal(old_icon);

						editor.toggleFullSize(false);
						expect(button.textContent).equals(old_icon);
					});
				});
			});

			it('Should not change size by content after window was resized', function () {
				const editor = getUnidit({
					height: 300
				});

				editor.value = '<p>test</p>'.repeat(20);
				expect(editor.container.offsetHeight).equals(300);

				simulateEvent('resize', 0, window);
				expect(editor.container.offsetHeight).equals(300);
			});
		});

		describe('Autosize', function () {
			it('Should set editor height by content', function () {
				const editor = getUnidit();
				editor.value = '<p>test</p>'.repeat(100);
				expect(editor.container.offsetHeight).to.be.above(1000);
			});

			describe('Max height', function () {
				it('Should set limited height', function () {
					const editor = getUnidit({
						maxHeight: 500
					});

					editor.value = '<p>test</p>'.repeat(1);
					expect(editor.container.offsetHeight).equals(200);

					editor.value = '<p>test</p>'.repeat(100);
					expect(editor.container.offsetHeight).equals(500);
				});
			});

			it('Should set editor height by content in iframe mode', function () {
				const editor = getUnidit({
					iframe: true
				});
				editor.value = '<p>test</p>'.repeat(100);
				expect(editor.container.offsetHeight).to.be.above(1000);
			});
		});
	});

	describe('Set width', function () {
		describe('Resize handle', function () {
			describe('Allow X resizing', function () {
				it('Should show resize handle', function () {
					const editor = getUnidit({
						width: 400,
						allowResizeX: true
					});

					const handle = editor.container.querySelector(
						'.unidit-editor__resize'
					);

					expect(editor.container.offsetWidth).equals(400);

					simulateEvent('mousedown', handle, function (options) {
						options.clientX = 100;
						options.clientY = 100;
					});

					simulateEvent('mousemove', window, function (options) {
						options.clientX = 200;
						options.clientY = 200;
					});
					simulateEvent('mouseup', window);

					expect(editor.container.offsetWidth).equals(500);
				});
			});
		});
	});

	describe('Disable auto-height', function () {
		describe('Resize handle', function () {
			it('Should resize editor', function () {
				const box = getBox();
				box.style.width = 'auto';
				box.style.height = 'auto';

				const editor = getUnidit({
					height: 300,
					width: 400,
					allowResizeX: true,
					allowResizeY: true
				});
				expect(editor.container.offsetHeight).equals(300);

				const handle = editor.container.querySelector(
					'.unidit-editor__resize'
				);

				simulateEvent('mousedown', 0, handle, function (options) {
					options.clientX = 100;
					options.clientY = 100;
				});
				simulateEvent('mousemove', 0, window, function (options) {
					options.clientX = 200;
					options.clientY = 200;
				});
				simulateEvent('mouseup', 0, window);

				expect(editor.container.offsetHeight).equals(400);
				expect(editor.container.offsetWidth).equals(500);
			});

			describe('Disable X resizing', function () {
				it('Should resize editor only by vertical', function () {
					getBox().style.width = 'auto';
					getBox().style.height = 'auto';

					const editor = getUnidit({
						height: 300,
						width: 400,
						allowResizeX: false,
						allowResizeY: true
					});

					const handle = editor.container.querySelector(
						'.unidit-editor__resize'
					);

					expect(editor.container.offsetHeight).equals(300);
					expect(editor.container.offsetWidth).equals(400);

					simulateEvent('mousedown', 0, handle, function (options) {
						options.clientX = 100;
						options.clientY = 100;
					});

					simulateEvent('mousemove', 0, window, function (options) {
						options.clientX = 200;
						options.clientY = 200;
					});
					simulateEvent('mouseup', 0, window);

					expect(editor.container.offsetHeight).equals(400);
					expect(editor.container.offsetWidth).equals(400);
				});
			});
		});

		describe('Change box size', function () {
			describe('Auto width mode', function () {
				describe('Change box width', function () {
					it('should set fixed height but width must be auto', function () {
						const box = getBox();
						const editor = getUnidit({
							height: 300
						});

						box.style.width = '400px';

						const handle = editor.container.querySelector(
							'.unidit-editor__resize'
						);

						expect(editor.container.offsetHeight).equals(300);

						simulateEvent(
							'mousedown',
							0,
							handle,
							function (options) {
								options.clientX = 100;
								options.clientY = 100;
							}
						);

						simulateEvent(
							'mousemove',
							0,
							window,
							function (options) {
								options.clientX = 200;
								options.clientY = 200;
							}
						);

						simulateEvent('mouseup', 0, window);

						box.style.width = '600px';

						expect(editor.container.offsetHeight).equals(400);
						expect(editor.container.offsetWidth).equals(600);
					});
				});
			});
		});
	});
});
