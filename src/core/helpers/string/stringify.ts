/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/string
 */

import type { CanUndef } from 'unidit/types';

/**
 * Safe stringify circular object
 */
export function stringify(
	value: unknown,
	options: {
		excludeKeys?: string[];
		prettify?: string;
	} = {}
): string {
	if (typeof value !== 'object') {
		return String(value);
	}

	const excludeKeys = new Set(options.excludeKeys);

	const map = new WeakMap();

	const r = (k: string, v: any): CanUndef<string> => {
		if (excludeKeys.has(k)) {
			return;
		}

		if (typeof v === 'object' && v != null) {
			if (map.get(v)) {
				return '[refObject]';
			}

			map.set(v, true);
		}

		return v;
	};

	return JSON.stringify(value, r, options.prettify);
}
