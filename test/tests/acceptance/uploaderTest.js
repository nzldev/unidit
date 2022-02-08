/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Test uploader module', function () {
	describe('Drop file', function () {
		describe('Drop Image like base64', function () {
			it('Should insert image with SRC in base64', function (done) {
				const file = new FileImage(),
					editor = getUnidit({
						resizer: {
							forImageChangeAttributes: true
						},
						uploader: {
							insertImageAsBase64URI: true
						},
						events: {
							afterInsertImage: function (img) {
								expect(img.src).equals(file.dataURI);
								expect(sortAttributes(editor.value)).equals(
									'<p><img src="' +
										file.dataURI +
										'" width="300px"></p>'
								);
								done();
							}
						}
					});

				simulateEvent('drop', editor.editor, function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});
		});

		describe('Drop Image and upload on server', function () {
			it('Should upload file and insert image with SRC from server', function (done) {
				const file = new FileImage(),
					editor = getUnidit({
						observer: {
							timeout: 0
						},
						uploader: {
							url: 'https://nazrul.dev/unidit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertImage: function (img) {
								expect(img.src).equals(
									'https://nazrul.dev/unidit/files/logo.gif'
								);

								expect(sortAttributes(editor.value)).equals(
									'<p><img src="https://nazrul.dev/unidit/files/logo.gif" style="width:300px"></p>'
								);

								done();
							}
						}
					});

				simulateEvent('drop', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('For iframe mode', function () {
				it('Should upload file and insert image with SRC from server', function (done) {
					const timer = setTimeout(function () {
						expect(true).is.false;
					}, 4000);

					const file = new FileImage(),
						editor = getUnidit({
							iframe: true,
							observer: {
								timeout: 0
							},
							uploader: {
								url: 'https://nazrul.dev/unidit/connector/index.php?action=fileUpload'
							},
							events: {
								afterInsertImage: function (img) {
									clearTimeout(timer);

									expect(img.src).equals(
										'https://nazrul.dev/unidit/files/logo.gif'
									);
									expect(sortAttributes(editor.value)).equals(
										'<p><img src="https://nazrul.dev/unidit/files/logo.gif" style="width:300px"></p>'
									);
									done();
								}
							}
						});

					setTimeout(function () {
						simulateEvent(
							'drop',
							0,
							editor.editor,
							function (data) {
								Object.defineProperty(data, 'dataTransfer', {
									value: {
										files: [file]
									}
								});
							}
						);
					}, 300);
				});
			});
		});

		describe('Drop File and upload on server', function () {
			it('Should upload file and insert A element with HREF to file on server', function (done) {
				const file = new FileXLS(),
					editor = getUnidit({
						observer: {
							timeout: 0
						},
						uploader: {
							url: 'https://nazrul.dev/unidit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertNode: function (node) {
								expect(node.href).equals(
									'https://nazrul.dev/unidit/files/file.xls'
								);
								expect(editor.value).equals(
									'<p><a href="https://nazrul.dev/unidit/files/file.xls">https://nazrul.dev/unidit/files/file.xls</a></p>'
								);
								done();
							}
						}
					});

				simulateEvent('drop', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('Drop with insertImageAsBase64URI=true', function () {
				it('Should upload file and insert A element with HREF to file on server', function (done) {
					const file = new FileXLS(),
						editor = getUnidit({
							observer: {
								timeout: 0
							},
							uploader: {
								url: 'https://nazrul.dev/unidit/connector/index.php?action=fileUpload',
								insertImageAsBase64URI: true
							},
							events: {
								afterInsertNode: function (node) {
									expect(node.href).equals(
										'https://nazrul.dev/unidit/files/file.xls'
									);
									expect(editor.value).equals(
										'<p><a href="https://nazrul.dev/unidit/files/file.xls">https://nazrul.dev/unidit/files/file.xls</a></p>'
									);
									done();
								}
							}
						});

					simulateEvent('drop', 0, editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});
			});
		});
	});
});
