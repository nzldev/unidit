/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
module.exports = class PostBuild {
	constructor(fn) {
		this.fn = fn;
	}

	apply(compiler) {
		const handler = stats => {
			if (typeof this.fn === 'function') {
				try {
					this.fn(stats);
				} catch (e) {
					console.log(e);
				}
			}
		};

		if (compiler.hooks) {
			compiler.hooks.done.tap('PostBuild', handler);
		} else {
			compiler.plugin('done', handler);
		}
	}
};
