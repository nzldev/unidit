/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

import type { IUnidit, IViewBased } from 'unidit/types';
import { isFunction } from './is-function';
import { modules } from '../../global';

/**
 * Check if element is instance of Unidit
 */
export function isUniditObject(unidit: unknown): unidit is IUnidit {
	return Boolean(
		unidit &&
			unidit instanceof Object &&
			isFunction(unidit.constructor) &&
			// @ts-ignore
			((typeof Unidit !== 'undefined' && unidit instanceof Unidit) ||
				(unidit as IUnidit).isUnidit)
	);
}

/**
 * Check if element is instance of View
 */
export function isViewObject(unidit: unknown): unidit is IViewBased {
	return Boolean(
		unidit &&
			unidit instanceof Object &&
			isFunction(unidit.constructor) &&
			(unidit instanceof modules.View || (unidit as IViewBased).isView)
	);
}
