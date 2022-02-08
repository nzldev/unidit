/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/normalize
 */

/**
 * Normalize value to CSS meters
 */
export const normalizeSize = (value: string | number): string => {
	if (/^[0-9]+$/.test(value.toString())) {
		return value + 'px';
	}
	return value.toString();
};
