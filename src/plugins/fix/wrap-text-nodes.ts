/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/fix
 */

import type { IUnidit, Nullable } from 'unidit/types';
import { Plugin } from 'unidit/core/plugin';
import { Dom } from 'unidit/core/dom';
import { isString } from 'unidit/core/helpers/checker';
import { autobind } from 'unidit/core/decorators';

/**
 * Wrap single text nodes in block wrapper
 */
export class WrapTextNodes extends Plugin {
	/** @override **/
	protected afterInit(unidit: IUnidit): void {
		if (unidit.o.enter.toLowerCase() === 'br') {
			return;
		}

		unidit.e.on(
			'afterInit.wtn postProcessSetEditorValue.wtn',
			this.postProcessSetEditorValue
		);
	}

	/** @override **/
	protected beforeDestruct(unidit: IUnidit): void {
		unidit.e.off('.wtn');
	}

	/**
	 * Process changed value
	 */
	@autobind
	private postProcessSetEditorValue() {
		const { unidit } = this;

		if (!unidit.isEditorMode()) {
			return;
		}

		let child: Nullable<Node> = unidit.editor.firstChild,
			isChanged: boolean = false;

		while (child) {
			if (this.isSuitableStart(child)) {
				if (!isChanged) {
					unidit.s.save();
				}

				isChanged = true;
				const box = unidit.createInside.element(unidit.o.enter);

				Dom.before(child, box);

				while (child && this.isSuitable(child)) {
					const next: Nullable<Node> = child.nextSibling;
					box.appendChild(child);
					child = next;
				}

				box.normalize();
			}

			child = child && child.nextSibling;
		}

		if (isChanged) {
			unidit.s.restore();

			if (unidit.e.current === 'afterInit') {
				unidit.e.fire('internalChange');
			}
		}
	}

	/**
	 * Found Node which should be wrapped
	 */
	private isSuitableStart = (n: Nullable<Node>): boolean =>
		(Dom.isText(n) && isString(n.nodeValue) && /[^\s]/.test(n.nodeValue)) ||
		(this.isNotClosed(n) && !Dom.isTemporary(n));

	/**
	 * Node should add in block element
	 */
	private isSuitable = (n: Nullable<Node>): boolean =>
		Dom.isText(n) || this.isNotClosed(n);

	/**
	 * Some element which need append in block
	 */
	private isNotClosed = (n: Nullable<Node>): n is Element =>
		Dom.isElement(n) && !(Dom.isBlock(n) || Dom.isTag(n, ['hr', 'style']));
}
