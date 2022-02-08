/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import { findNotEmptySibling } from 'unidit/plugins/keyboard/helpers';

/**
 * Check if it is possible to remove an empty adjacent element.
 *
 * @example
 * ```html
 * <p><br></p><p>|second stop</p>
 * ```
 * result
 * ```html
 * <p>|second stop</p>
 * ```
 * @private
 */
export function checkRemoveEmptyNeighbor(
	unidit: IUnidit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	const parent = Dom.closest(fakeNode, Dom.isElement, unidit.editor);

	if (!parent) {
		return false;
	}

	const neighbor = findNotEmptySibling(parent, backspace);

	if (neighbor && Dom.isEmpty(neighbor)) {
		Dom.safeRemove(neighbor);
		unidit.s.setCursorBefore(fakeNode);
		return true;
	}

	return false;
}
