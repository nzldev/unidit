/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

module.exports.fileName = ({ argv, ES, isTest, excludeLangs, uglify }) => {
	if (argv.filename) {
		return argv.filename;
	}

	return name =>
		name +
		(ES === 'es5' || isTest ? '' : '.' + ES) +
		(excludeLangs ? '.en' : '') +
		(uglify ? '.min' : '');
};
