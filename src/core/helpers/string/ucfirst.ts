/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/string
 */

/**
 * Make a string's first character uppercase
 */
export function ucfirst(value: string): string {
	if (!value.length) {
		return '';
	}

	return value[0].toUpperCase() + value.substr(1);
}
