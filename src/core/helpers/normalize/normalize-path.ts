/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/normalize
 */

import { trim } from '../string';

/**
 * Replaces back slashes and correctly concatenates several parts of the path.
 */
export const normalizePath = (...path: string[]): string => {
	return path
		.filter(part => trim(part).length)
		.map((part, index) => {
			part = part.replace(/([^:])[\\/]+/g, '$1/');

			if (index) {
				part = part.replace(/^\//, '');
			}

			if (index !== path.length - 1) {
				part = part.replace(/\/$/, '');
			}

			return part;
		})
		.join('/');
};
