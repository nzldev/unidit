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
 * Checks if the parent of an element is suitable for applying styles, if applicable, then returns the parent *
 *
 * @param style - styles to be applied
 * @param node - checked item
 * @param root - editor root
 * @private
 */
export function getSuitParent(
	style: CommitStyle,
	node: Node,
	root: Node
): Nullable<HTMLElement> {
	const { parentNode } = node;

	if (
		Dom.isHTMLElement(parentNode) &&
		!Dom.next(node, isNormalNode, parentNode) &&
		!Dom.prev(node, isNormalNode, parentNode) &&
		isSuitElement(style, parentNode, false) &&
		parentNode !== root &&
		(!Dom.isBlock(parentNode) || style.elementIsBlock)
	) {
		return parentNode;
	}

	return null;
}
