/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/insert
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import { Dom } from 'unidit/core/dom';

Config.prototype.controls.hr = {
	command: 'insertHorizontalRule',
	tags: ['hr'],
	tooltip: 'Insert Horizontal Line'
} as IControlType;

export function hr(editor: IUnidit): void {
	editor.registerButton({
		name: 'hr',
		group: 'insert'
	});

	editor.registerCommand('insertHorizontalRule', () => {
		const elm = editor.createInside.element('hr');
		editor.s.insertNode(elm, false, false);

		const block = Dom.closest(
			elm.parentElement,
			Dom.isBlock,
			editor.editor
		);

		if (block && Dom.isEmpty(block) && block !== editor.editor) {
			Dom.after(block, elm);
			Dom.safeRemove(block);
		}

		let p = Dom.next(elm, Dom.isBlock, editor.editor, false);

		if (!p) {
			p = editor.createInside.element(editor.o.enter);
			Dom.after(elm, p);
		}

		editor.s.setCursorIn(p);

		return false;
	});
}
