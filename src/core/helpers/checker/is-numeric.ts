/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

import { isString } from './is-string';

/**
 * Check value has numeric format
 */
export function isNumeric(value: number | string): boolean {
	if (isString(value)) {
		if (!value.match(/^([+-])?[0-9]+(\.?)([0-9]+)?(e[0-9]+)?$/)) {
			return false;
		}

		value = parseFloat(value);
	}

	return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
