/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit, Nullable } from 'unidit/types';
import { findNotEmptySibling } from 'unidit/plugins/keyboard/helpers';
import { Dom } from 'unidit/core/dom';

/**
 * Check if two separate elements can be connected
 */
export function checkJoinNeighbors(
	unidit: IUnidit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	let nextBox: Nullable<Node> = fakeNode,
		mainClosestBox: Nullable<Node> = nextBox;

	// Find main big closest element
	while (
		nextBox &&
		!findNotEmptySibling(nextBox, backspace) &&
		nextBox.parentElement !== unidit.editor
	) {
		nextBox = nextBox.parentElement;
		mainClosestBox = nextBox;
	}

	if (
		Dom.isElement(mainClosestBox) &&
		Dom.isContentEditable(mainClosestBox, unidit.editor)
	) {
		const sibling = findNotEmptySibling(
			mainClosestBox,
			backspace
		) as Nullable<Element>;

		if (
			sibling &&
			(checkMoveListContent(unidit, mainClosestBox, sibling, backspace) ||
				moveContentAndRemoveEmpty(
					unidit,
					mainClosestBox,
					sibling,
					backspace
				))
		) {
			unidit.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	return false;
}

function checkMoveListContent(
	unidit: IUnidit,
	mainClosestBox: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	// Process UL/LI/OL cases
	const siblingIsList = Dom.isTag(sibling, ['ol', 'ul']);
	const boxIsList = Dom.isTag(mainClosestBox, ['ol', 'ul']);
	const elementChild = (elm: Element, side: boolean) =>
		side ? elm.firstElementChild : elm.lastElementChild;

	if (boxIsList) {
		sibling = unidit.createInside.element(unidit.o.enterBlock);
		Dom.before(mainClosestBox, sibling);

		return moveContentAndRemoveEmpty(
			unidit,
			elementChild(mainClosestBox, backspace),
			sibling,
			backspace
		);
	}

	if (sibling && siblingIsList && !boxIsList) {
		return moveContentAndRemoveEmpty(
			unidit,
			mainClosestBox,
			elementChild(sibling, !backspace),
			backspace
		);
	}

	return false;
}

function moveContentAndRemoveEmpty(
	unidit: IUnidit,
	mainClosestBox: Nullable<Node>,
	sibling: Nullable<Node>,
	backspace: boolean
): boolean {
	// Move content and remove empty nodes
	if (mainClosestBox && Dom.isElement(sibling)) {
		Dom.moveContent(mainClosestBox, sibling, !backspace);

		let remove: Nullable<Node> = mainClosestBox;

		while (remove && remove !== unidit.editor && Dom.isEmpty(remove)) {
			const parent: Nullable<Node> = remove.parentElement;
			Dom.safeRemove(remove);
			remove = parent;
		}

		return true;
	}

	return false;
}
