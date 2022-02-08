/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import type { CommitStyle } from '../commit-style';

/**
 * Replaces non-leaf items with leaf items and either creates a new list or
 * adds a new item to the nearest old list
 * @private
 */
export function wrapOrderedList(
	commitStyle: CommitStyle,
	wrapper: HTMLElement,
	unidit: IUnidit
): HTMLElement {
	const newWrapper = Dom.replace(wrapper, 'li', unidit.createInside);

	let list =
		newWrapper.previousElementSibling || newWrapper.nextElementSibling;

	if (!Dom.isTag(list, ['ul', 'ol'])) {
		list = unidit.createInside.element(commitStyle.element);
		Dom.before(newWrapper, list);
	}

	if (newWrapper.previousElementSibling === list) {
		Dom.append(list, newWrapper);
	} else {
		Dom.prepend(list, newWrapper);
	}

	return <HTMLElement>list;
}
