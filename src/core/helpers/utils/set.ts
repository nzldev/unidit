/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type { IDictionary } from 'unidit/types';
import { isString } from '../checker/is-string';
import { isNumeric } from '../checker/is-numeric';
import { isArray } from '../checker/is-array';
import { isPlainObject } from '../checker';

/**
 * Safe access in tree object
 *
 * @example
 * ```js
 * const a = {}, b = {};
 * Unidit.modules.Helpers.set('a.b.c.d.e', 1, a);
 * console.log(a);// {a: {b: {c: {d: {e: 1}}}}}
 *
 * Unidit.modules.Helpers.set('a.0.e', 1, b);
 * console.log(b);// {a: [{e: 1}]}
 * ```
 */
export function set<T>(chain: string, value: unknown, obj: IDictionary): void {
	if (!isString(chain) || !chain.length) {
		return;
	}

	const parts = chain.split('.');

	let result = obj,
		key = parts[0];

	for (let i = 0; i < parts.length - 1; i += 1) {
		key = parts[i];

		if (!isArray(result[key]) && !isPlainObject(result[key])) {
			result[key] = isNumeric(parts[i + 1]) ? [] : {};
		}

		result = result[key];
	}

	if (result) {
		result[parts[parts.length - 1]] = value;
	}
}
