/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit, Nullable } from 'unidit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'unidit/core/dom';

/**
 * Wrap text or inline elements inside Block element
 * @private
 */
export function wrapUnwrappedText(
	style: CommitStyle,
	elm: Node,
	unidit: IUnidit,
	getRange: () => Range
): HTMLElement {
	const root = unidit.editor,
		ci = unidit.createInside,
		edge = (n: Node, key: keyof Node = 'previousSibling') => {
			let edgeNode: Node = n,
				node: Nullable<Node> = n;

			while (node) {
				if (Dom.isTag(node, unidit.o.enter)) {
					break;
				}

				edgeNode = node;

				if (node[key]) {
					node = node[key] as Nullable<Node>;
				} else {
					node =
						node.parentNode &&
						!Dom.isBlock(node.parentNode) &&
						node.parentNode !== root
							? node.parentNode
							: null;
				}

				if (Dom.isBlock(node)) {
					break;
				}
			}

			return edgeNode;
		};

	const start: Node = edge(elm),
		end: Node = edge(elm, 'nextSibling');

	const range = getRange();
	range.setStartBefore(start);
	range.setEndAfter(end);
	const fragment = range.extractContents();

	const wrapper = ci.element(style.element);
	wrapper.appendChild(fragment);
	range.insertNode(wrapper);

	if (style.elementIsBlock) {
		if (
			Dom.isEmpty(wrapper) &&
			!Dom.isTag(wrapper.firstElementChild, 'br')
		) {
			wrapper.appendChild(ci.element('br'));
		}
	}

	return wrapper;
}
