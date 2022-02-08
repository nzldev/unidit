/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import { Dom } from '../../../../core/dom';
import type { IUnidit } from 'unidit/types';

/**
 * Inside the CELL table - nothing to do
 *
 * @example
 * ```html
 * <table><tr><td>|test</td></tr></table>
 * ```
 * result
 * ```html
 * <table><tr><td>|test</td></tr></table>
 * ```
 *
 * @private
 */
export function checkTableCell(unidit: IUnidit, fakeNode: Node): boolean {
	const cell = fakeNode.parentElement;

	if (Dom.isCell(cell)) {
		return true;
	}

	return false;
}
