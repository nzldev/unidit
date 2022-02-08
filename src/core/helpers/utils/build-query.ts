/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type { IDictionary } from 'unidit/types';
import { isPlainObject } from '../checker';

/**
 * Build query string
 */
export const buildQuery = (data: IDictionary, prefix?: string): string => {
	const str: string[] = [];

	const enc = encodeURIComponent;

	for (const dataKey in data) {
		if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
			const k = prefix ? prefix + '[' + dataKey + ']' : dataKey;
			const v = data[dataKey];

			str.push(
				isPlainObject(v) ? buildQuery(v, k) : enc(k) + '=' + enc(v)
			);
		}
	}

	return str.join('&');
};
