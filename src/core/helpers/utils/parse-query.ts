/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type { IDictionary } from 'unidit/types';

/**
 * Parse query string
 */
export const parseQuery = (queryString: string): IDictionary<string> => {
	const query: IDictionary<string> = {},
		a = queryString.substr(1).split('&');

	for (let i = 0; i < a.length; i += 1) {
		const keyValue = a[i].split('=');
		query[decodeURIComponent(keyValue[0])] = decodeURIComponent(
			keyValue[1] || ''
		);
	}

	return query;
};
