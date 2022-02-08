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
 * Check if a string is html or not
 */
export const isHTML = (str: unknown): str is string =>
	isString(str) &&
	/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/m.test(
		str.replace(/[\r\n]/g, '')
	);
