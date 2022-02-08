/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

import { isNumeric } from './is-numeric';
import { isString } from './is-string';

/**
 * Check value is Int
 */
export function isInt(value: number | string): boolean {
	if (isString(value) && isNumeric(value)) {
		value = parseFloat(value);
	}

	return typeof value === 'number' && Number.isFinite(value) && !(value % 1);
}
