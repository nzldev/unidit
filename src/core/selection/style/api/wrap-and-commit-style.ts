/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IUnidit } from 'unidit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'unidit/core/dom';
import { wrapUnwrappedText } from './wrap-unwrapped-text';
import { attr } from 'unidit/core/helpers';
import { wrapOrderedList } from './wrap-ordered-list';

/**
 * Replaces the parent tag with the applicable one, or wraps the text and also replaces the tag
 * @private
 */
export function wrapAndCommitStyle(
	commitStyle: CommitStyle,
	font: HTMLElement,
	unidit: IUnidit
): HTMLElement {
	const wrapper = findOrCreateWrapper(commitStyle, font, unidit);

	return commitStyle.elementIsList
		? wrapOrderedList(commitStyle, wrapper, unidit)
		: Dom.replace(wrapper, commitStyle.element, unidit.createInside, true);
}

/**
 * If we apply a block element, then it finds the closest block parent (exclude table cell etc.),
 * otherwise it wraps free text in an element.
 */
function findOrCreateWrapper(
	commitStyle: CommitStyle,
	font: HTMLElement,
	unidit: IUnidit
): HTMLElement {
	if (commitStyle.elementIsBlock) {
		const box = Dom.up(
			font,
			node =>
				Dom.isBlock(node) &&
				!Dom.isTag(node, [
					'td',
					'th',
					'tr',
					'tbody',
					'table',
					'li',
					'ul',
					'ol'
				]),
			unidit.editor
		);

		if (box) {
			return box;
		}
	}

	if (commitStyle.elementIsBlock) {
		return wrapUnwrappedText(commitStyle, font, unidit, unidit.s.createRange);
	}

	attr(font, 'size', null);

	return font;
}
