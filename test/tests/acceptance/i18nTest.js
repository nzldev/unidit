/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
describe('Test i18n functionality', function () {
	describe('Test has keys in all functionality', function () {
		const filter = [
			'customxxx',
			'customxxx',
			'Ok',
			'Link',
			'Code',
			'Embed code',
			'Normal',
			'Text',
			'Split',
			'Unidit Editor',
			'License: %s',
			'Split vertical',
			'Src',
			'Edit',
			'Split horizontal',
			'Styles',
			'Classes',
			'Alternative',
			'Image',
			'Border'
		];

		Object.keys(Unidit.lang)
			.filter(function (language) {
				return language !== 'en';
			})
			.forEach(function (language) {
				it(
					'Should have value for all key in ' +
						language +
						' language',
					function () {
						const editor = getUnidit({
							language: language,
							debugLanguage: true
						});

						i18nkeys
							.filter(function (key) {
								return (
									filter.indexOf(key) === -1 &&
									!/^[0-9]+(pt|px)?$/.test(key)
								);
							})
							.forEach(function (key) {
								expect('{' + key + '}').does.not.equal(
									editor.i18n(key)
								);
							});
					}
				);
			});
	});
	describe('Test i18n function', function () {
		it('Should show value in current language', function () {
			const editor = getUnidit({
				language: 'ru',
				i18n: {
					ru: {
						'Test %s': 'Тест %s',
						'Test %d': 'Тест %d',
						'Test %s %d': 'Тест %s %d'
					}
				}
			});
			expect(editor.i18n('Type something')).equals('Напишите что-либо');
			expect(editor.i18n('Test %s', 'строка')).equals('Тест строка');
			expect(editor.i18n('Test %s %d', 'строка', 1)).equals(
				'Тест строка 1'
			);
		});
	});
});
