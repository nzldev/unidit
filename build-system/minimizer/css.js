/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => new CssMinimizerPlugin({
	parallel: true,
	minimizerOptions: {
		preset: [
			'advanced',
			{
				discardComments: { removeAll: true },
				zindex: false
			}
		]
	}
});
