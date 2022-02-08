/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

const path = require('path');

module.exports = ({ superDirname }) => {
	return {
		test: /\.(ts)$/,
		use: [
			{
				loader: path.resolve(__dirname, '../loaders/lang-loader')
			}
		],
		include: path.resolve(superDirname, './src/langs'),
		exclude: path.resolve(superDirname, './src/langs/index.ts')
	};
};
