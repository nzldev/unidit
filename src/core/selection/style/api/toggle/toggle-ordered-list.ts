/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit, CommitMode } from 'unidit/types';
import type { CommitStyle } from '../../commit-style';
import { Dom } from 'unidit/core/dom';
import { extractSelectedPart } from '../extract';
import { CHANGE, INITIAL, REPLACE } from '../../commit-style';
import { toggleCSS } from './toggle-css';

/**
 * Replaces `ul->ol` or `ol->ul`, apply styles to the list, or remove a list item from it
 * @private
 */
export function toggleOrderedList(
	style: CommitStyle,
	li: HTMLElement,
	unidit: IUnidit,
	mode: CommitMode
): CommitMode {
	if (!li) {
		return mode;
	}

	const list = li.parentElement;

	if (!list) {
		return mode;
	}

	// ul => ol, ol => ul
	if (list.tagName.toLowerCase() !== style.element) {
		const newList = Dom.replace(list, style.element, unidit.createInside);
		toggleCSS(style, newList, unidit, mode);
		return REPLACE;
	}

	if (toggleCSS(style, li.parentElement, unidit, INITIAL, true) === CHANGE) {
		return toggleCSS(style, li.parentElement, unidit, mode);
	}

	extractSelectedPart(list, li, unidit);
	Dom.unwrap(li.parentElement);
	Dom.replace(li, unidit.o.enter, unidit.createInside);

	return mode;
}
