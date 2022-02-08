/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/keyboard
 */

import type { IUnidit, Nullable } from 'unidit/types';
import { call } from 'unidit/core/helpers/utils';
import { Dom } from 'unidit/core/dom';
import { INSEPARABLE_TAGS } from 'unidit/core/constants';
import { trim } from 'unidit/core/helpers/string';

export function getSibling(node: Node, backspace: boolean): Nullable<Node> {
	return backspace ? node.previousSibling : node.nextSibling;
}

/**
 * Returns the nearest non-empty neighbor
 */
export function findNotEmptyNeighbor(
	node: Node,
	left: boolean,
	root: HTMLElement
): Nullable<Node> {
	return call(
		left ? Dom.prev : Dom.next,
		node,
		n => Boolean(n && (!Dom.isText(n) || trim(n?.nodeValue || '').length)),
		root
	);
}

/**
 * Returns the nearest non-empty sibling
 */
export function findNotEmptySibling(
	node: Node,
	backspace: boolean
): Nullable<Node> {
	return Dom.findSibling(node, backspace, n => {
		return (
			!Dom.isEmptyTextNode(n) &&
			Boolean(
				!Dom.isText(n) || (n.nodeValue?.length && trim(n.nodeValue))
			)
		);
	});
}

/**
 * Finds the nearest neighbor that would be in the maximum nesting depth.
 * Ie if neighbor `<DIV><SPAN>Text` then return Text node.
 */
export function findMostNestedNeighbor(
	node: Node,
	right: boolean,
	root: HTMLElement,
	onlyInlide: boolean = false
): Nullable<Node> {
	const nextChild = (node: Node) =>
		right ? node.firstChild : node.lastChild;

	let next = findNotEmptyNeighbor(node, !right, root);

	if (onlyInlide && Dom.isElement(next) && !Dom.isInlineBlock(next)) {
		return null;
	}

	if (next) {
		do {
			if (nextChild(next)) {
				next = nextChild(next);
			} else {
				return next;
			}
		} while (next);
	}

	return null;
}

/**
 * Moves the fake node inside the adjacent element if it lies next to it but not inside.
 * When the cursor is positioned in its place, it must be inside the element and not outside its border.
 */
export function normalizeCursorPosition(
	unidit: IUnidit,
	node: Node,
	backspace: boolean
): void {
	let sibling = Dom.findSibling(node, backspace),
		anotherSibling = Dom.findSibling(node, !backspace);

	while (
		Dom.isElement(sibling) &&
		!Dom.isTag(sibling, INSEPARABLE_TAGS) &&
		Dom.isContentEditable(sibling, unidit.editor) &&
		(!anotherSibling || !Dom.closest(node, Dom.isElement, unidit.editor))
	) {
		if (backspace || !sibling.firstChild) {
			sibling.appendChild(node);
		} else {
			Dom.before(sibling.firstChild, node);
		}

		sibling = getSibling(node, backspace);
		anotherSibling = getSibling(node, !backspace);
	}
}
