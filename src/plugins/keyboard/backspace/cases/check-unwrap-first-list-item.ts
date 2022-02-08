/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import { call } from 'unidit/core/helpers/utils';

/**
 * For first item in list on backspace try move his content in new P
 *
 * @example
 * ```html
 * <ul><li>|first</li><li>second</li></ul>
 * ```
 * Result
 * ```html
 * <p>|first</p><ul><li>second</li></ul>
 * ```
 *
 * @private
 */
export function checkUnwrapFirstListItem(
	unidit: IUnidit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	const li = Dom.closest(fakeNode, Dom.isElement, unidit.editor);

	const { s } = unidit;

	if (
		Dom.isTag(li, 'li') &&
		li?.parentElement?.[
			backspace ? 'firstElementChild' : 'lastElementChild'
		] === li &&
		s.cursorInTheEdge(backspace, li)
	) {
		const ul = li.parentElement;
		const p = unidit.createInside.element(unidit.o.enterBlock);

		call(backspace ? Dom.before : Dom.after, ul, p);

		Dom.moveContent(li, p);
		Dom.safeRemove(li);

		if (Dom.isEmpty(ul)) {
			Dom.safeRemove(ul);
		}

		call(backspace ? s.setCursorBefore : s.setCursorAfter, fakeNode);

		return true;
	}

	return false;
}
