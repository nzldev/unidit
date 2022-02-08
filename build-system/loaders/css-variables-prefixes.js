/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

module.exports = function (source) {
	this.cacheable && this.cacheable(true);
	return source.replace(/--([a-z0-9_-]+)/g, '--jd-$1');
};

module.exports.seperable = true;
