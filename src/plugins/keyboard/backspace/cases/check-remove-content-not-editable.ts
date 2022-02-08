/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
import type { IUnidit } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import { call } from 'unidit/core/helpers';
import { normalizeCursorPosition } from 'unidit/plugins/keyboard/helpers';

/**
 * Checks if a non-editable element can be deleted
 * @private
 */
export function checkRemoveContentNotEditable(
	unidit: IUnidit,
	fakeNode: Text,
	backspace: boolean
): boolean {
	let neighbor = Dom.findSibling(fakeNode, backspace);

	if (
		!neighbor &&
		fakeNode.parentElement &&
		fakeNode.parentElement !== unidit.editor
	) {
		neighbor = Dom.findSibling(fakeNode.parentElement, backspace);
	}

	if (
		Dom.isElement(neighbor) &&
		!Dom.isContentEditable(neighbor, unidit.editor)
	) {
		call(backspace ? Dom.before : Dom.after, neighbor, fakeNode);
		Dom.safeRemove(neighbor);
		normalizeCursorPosition(unidit, fakeNode, backspace);

		call(
			backspace ? unidit.s.setCursorBefore : unidit.s.setCursorAfter,
			fakeNode
		);

		return true;
	}

	return false;
}
