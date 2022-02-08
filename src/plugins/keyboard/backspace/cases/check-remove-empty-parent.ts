/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit, Nullable } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import { findNotEmptyNeighbor } from 'unidit/plugins/keyboard/helpers';
import { INSEPARABLE_TAGS } from 'unidit/core/constants';
import { checkJoinTwoLists } from 'unidit/plugins/keyboard/backspace/cases/check-join-two-lists';

/**
 * Check if the current empty item can be removed
 *
 * @example
 * ```html
 * <p>first stop</p><p>|<br></p>
 * ```
 * result
 * ```html
 * <p>first stop|</p>
 * ```
 *
 * @private
 */
export function checkRemoveEmptyParent(
	unidit: IUnidit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	let found: boolean = false;
	const { setCursorBefore, setCursorIn } = unidit.s;

	let prn: Nullable<Node> = Dom.closest(
		fakeNode,
		Dom.isElement,
		unidit.editor
	);

	if (!prn || !Dom.isEmpty(prn)) {
		return false;
	}

	const neighbor = findNotEmptyNeighbor(fakeNode, backspace, unidit.editor);

	do {
		if (prn && Dom.isEmpty(prn) && !Dom.isCell(prn)) {
			Dom.after(prn, fakeNode);

			const tmp: Nullable<Node> = Dom.closest(
				prn,
				n => Dom.isElement(n) && n !== prn,
				unidit.editor
			);

			Dom.safeRemove(prn);

			found = true;

			prn = tmp;
		} else {
			break;
		}
	} while (prn);

	if (found && checkJoinTwoLists(unidit, fakeNode, backspace)) {
		return true;
	}

	if (
		neighbor &&
		!Dom.isText(neighbor) &&
		!Dom.isTag(neighbor, INSEPARABLE_TAGS)
	) {
		setCursorIn(neighbor, !backspace);
	} else {
		setCursorBefore(fakeNode);
	}

	return found;
}
