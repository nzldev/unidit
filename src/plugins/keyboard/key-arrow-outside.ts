/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/keyboard
 */

import type { IUnidit } from 'unidit/types';
import { Plugin } from 'unidit/core/plugin';
import { watch } from 'unidit/core/decorators';
import { KEY_RIGHT, NBSP_SPACE } from 'unidit/core/constants';
import { Dom } from 'unidit/core/dom';
import { findNotEmptyNeighbor } from './helpers';

/**
 * Allowing to go outside of an inline element if there is no other element after that.
 */
export class KeyArrowOutside extends Plugin {
	protected afterInit(unidit: IUnidit): void {}

	protected beforeDestruct(unidit: IUnidit): void {}

	@watch(':keydown')
	protected onKeyDownArrow(e: KeyboardEvent): void {
		if (e.key !== KEY_RIGHT || !this.j.selection.isCollapsed()) {
			return;
		}

		const { endContainer, endOffset } = this.j.selection.range;

		if (!Dom.isText(endContainer)) {
			return;
		}

		if (endContainer.nodeValue?.length === endOffset) {
			const { parentNode } = endContainer;

			if (
				Dom.isInlineBlock(parentNode) &&
				!findNotEmptyNeighbor(parentNode, false, this.j.editor)
			) {
				Dom.after(parentNode, this.j.createInside.text(NBSP_SPACE));
			}
		}
	}
}
