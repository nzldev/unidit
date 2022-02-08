/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:modules/context-menu/README.md]]
 * @packageDocumentation
 * @module modules/context-menu
 */

import './context-menu.less';

import type { IContextMenu, IContextMenuAction } from 'unidit/types';
import { Popup } from 'unidit/core/ui/popup';
import { Button } from 'unidit/core/ui/button';
import { isArray } from 'unidit/core/helpers/checker';

/**
 * Module to generate context menu
 */
export class ContextMenu extends Popup implements IContextMenu {
	/** @override */
	override className(): string {
		return 'ContextMenu';
	}

	/**
	 * Generate and show context menu
	 *
	 * @param x - Global coordinate by X
	 * @param y - Global coordinate by Y
	 * @param actions - Array with plain objects `{icon: 'bin', title: 'Delete', exec: function () {}}`
	 * @example
	 * ```javascript
	 * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
	 * ```
	 */
	show(
		x: number,
		y: number,
		actions: Array<false | IContextMenuAction>
	): void {
		const self = this,
			content = this.j.c.div(this.getFullElName('actions'));

		if (!isArray(actions)) {
			return;
		}

		actions.forEach(item => {
			if (!item) {
				return;
			}

			const action = Button(this.unidit, item.icon || 'empty', item.title);
			this.unidit && action.setParentView(this.unidit);

			action.setMod('context', 'menu');

			action.onAction((e: MouseEvent) => {
				item.exec?.call(self, e);
				self.close();
				return false;
			});

			content.appendChild(action.container);
		});

		super
			.setContent(content)
			.open(() => ({ left: x, top: y, width: 0, height: 0 }), true);
	}
}
