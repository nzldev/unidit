/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

import type { IDictionary } from 'unidit/types';
import { isWindow } from './is-window';

/**
 * Check if element is simple plaint object
 */
export function isPlainObject<T>(
	obj: any | IDictionary<T>
): obj is IDictionary<T> {
	if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
		return false;
	}

	return !(
		obj.constructor &&
		!{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
	);
}
