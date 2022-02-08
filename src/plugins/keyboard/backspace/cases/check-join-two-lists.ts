/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit } from 'unidit/types';
import { Dom } from '../../../../core/dom';
import { call } from '../../../../core/helpers';

/**
 * Try join two UL elements
 *
 * @example
 * ```html
 * <ul><li>one</li></ul>|<ol><li>two</li></ol>
 * ```
 * Result
 * ```html
 * <ul><li>one|</li><li>two</li></ul>
 * ```
 * @private
 */
export function checkJoinTwoLists(
	unidit: IUnidit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	const next = Dom.findSibling(fakeNode, backspace),
		prev = Dom.findSibling(fakeNode, !backspace);

	if (
		!Dom.closest(fakeNode, Dom.isElement, unidit.editor) &&
		Dom.isTag(next, ['ul', 'ol']) &&
		Dom.isTag(prev, ['ul', 'ol']) &&
		Dom.isTag(next.lastElementChild, 'li') &&
		Dom.isTag(prev.firstElementChild, 'li')
	) {
		const { setCursorBefore, setCursorAfter } = unidit.s;

		const target = next.lastElementChild,
			second = prev.firstElementChild;

		call(!backspace ? Dom.append : Dom.prepend, second, fakeNode);

		Dom.moveContent(prev, next, !backspace);
		Dom.safeRemove(prev);

		call(backspace ? Dom.append : Dom.prepend, target, fakeNode);
		call(backspace ? setCursorBefore : setCursorAfter, fakeNode);

		return true;
	}

	return false;
}
