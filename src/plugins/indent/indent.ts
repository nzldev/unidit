/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/indent
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import { BR, PARAGRAPH } from 'unidit/core/constants';
import { Dom } from 'unidit/core/dom';
import { attr } from 'unidit/core/helpers';

Config.prototype.controls.indent = {
	tooltip: 'Increase Indent'
} as IControlType;

/**
 * Get style rule key for current direction
 */
const getKey = (
	direction: string,
	box: HTMLElement
): 'marginLeft' | 'marginRight' | 'paddingLeft' | 'paddingRight' =>
	`${Dom.isCell(box) ? 'padding' : 'margin'}${
		direction === 'rtl' ? 'Right' : 'Left'
	}`;

Config.prototype.controls.outdent = {
	isDisabled: (editor: IUnidit): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBox = Dom.closest(current, Dom.isBlock, editor.editor);

			if (currentBox) {
				const arrow = getKey(editor.o.direction, currentBox);
				return (
					!currentBox.style[arrow] ||
					parseInt(currentBox.style[arrow], 10) <= 0
				);
			}
		}

		return true;
	},
	tooltip: 'Decrease Indent'
} as IControlType;

declare module 'unidit/config' {
	interface Config {
		/**
		 * The number of pixels to use for indenting the current line.
		 */
		indentMargin: number;
	}
}

Config.prototype.indentMargin = 10;

/**
 * Indents the line containing the selection or insertion point.
 */
export function indent(editor: IUnidit): void {
	editor
		.registerButton({
			name: 'indent',
			group: 'indent'
		})
		.registerButton({
			name: 'outdent',
			group: 'indent'
		});

	const callback = (command: string): void | false => {
		const processedElements: HTMLElement[] = [];

		editor.s.eachSelection((current): false | void => {
			editor.s.save();

			let currentBox = current
				? Dom.up(current, Dom.isBlock, editor.editor)
				: false;

			const { enter } = editor.o;

			if (!currentBox && current) {
				currentBox = Dom.wrapInline(
					current,
					enter !== BR ? enter : PARAGRAPH,
					editor
				);
			}

			if (!currentBox) {
				editor.s.restore();
				return false;
			}

			const alreadyIndented = processedElements.includes(currentBox);

			if (currentBox && !alreadyIndented) {
				const key = getKey(editor.o.direction, currentBox);

				processedElements.push(currentBox);

				let value = currentBox.style[key]
					? parseInt(currentBox.style[key], 10)
					: 0;

				value +=
					editor.o.indentMargin * (command === 'outdent' ? -1 : 1);

				currentBox.style[key] = value > 0 ? value + 'px' : '';

				if (!attr(currentBox, 'style')) {
					attr(currentBox, 'style', null);
				}
			}

			editor.s.restore();
		});

		editor.setEditorValue();

		return false;
	};

	editor.registerCommand('indent', {
		exec: callback,
		hotkeys: ['ctrl+]', 'cmd+]']
	});

	editor.registerCommand('outdent', {
		exec: callback,
		hotkeys: ['ctrl+[', 'cmd+[']
	});
}
