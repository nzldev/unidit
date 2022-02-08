/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { Nullable } from 'unidit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'unidit/core/dom';
import { isNormalNode } from './is-normal-node';
import { isSuitElement } from './is-suit-element';

/**
 * Checks if child elements are suitable for applying styles.
 * An element is suitable for us only if it is the only significant child.
 * If the child matches then returns it.
 * @example
 * `<font><strong>selected</strong></font>`
 * @private
 */
export function getSuitChild(
	style: CommitStyle,
	font: HTMLElement
): Nullable<HTMLElement> {
	let { firstChild: child } = font;

	while (child && !isNormalNode(child)) {
		child = child.nextSibling;

		if (!child) {
			return null;
		}
	}

	if (
		child &&
		!Dom.next(child, isNormalNode, font) &&
		isSuitElement(style, child, false)
	) {
		return child;
	}

	return null;
}
