/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/clipboard
 */

import type { IDictionary, IUnidit, IControlType } from 'unidit/types';
import { Config } from 'unidit/config';
import { Dom } from 'unidit/core/dom';
import { css } from 'unidit/core/helpers/';

const pluginKey = 'copyformat';

/**
 * Plug-in copy and paste formatting from one element to another
 */

const copyStyles: string[] = [
	'fontWeight',
	'fontStyle',
	'fontSize',
	'color',
	'margin',
	'padding',
	'borderWidth',
	'borderStyle',
	'borderColor',
	'borderRadius',
	'backgroundColor',
	'textDecorationLine',
	'fontFamily'
];

const getStyle = (
	editor: IUnidit,
	key: string,
	box: HTMLElement,
	defaultStyles: IDictionary<string | number>
): string | number | undefined => {
	let result: string | number | undefined = css(box, key);

	if (result === defaultStyles[key]) {
		if (
			box.parentNode &&
			box !== editor.editor &&
			box.parentNode !== editor.editor
		) {
			result = getStyle(
				editor,
				key,
				box.parentNode as HTMLElement,
				defaultStyles
			);
		} else {
			result = undefined;
		}
	}

	return result;
};

const getStyles = (
	editor: IUnidit,
	box: HTMLElement,
	defaultStyles: IDictionary<string | number>
): IDictionary<string | number | undefined> => {
	const result: IDictionary<string | number | undefined> = {};

	if (box) {
		copyStyles.forEach((key: string) => {
			result[key] = getStyle(editor, key, box, defaultStyles);
			if (key.match(/border(Style|Color)/) && !result.borderWidth) {
				result[key] = undefined;
			}
		});
	}

	return result;
};

Config.prototype.controls.copyformat = {
	exec: (editor: IUnidit, current, { button }) => {
		if (!current) {
			return;
		}

		if (editor.buffer.exists(pluginKey)) {
			editor.buffer.delete(pluginKey);
			editor.e.off(editor.editor, 'mouseup.' + pluginKey);
		} else {
			const defaultStyles: IDictionary<string | number> = {},
				box =
					Dom.up(
						current,
						(elm: Node | null) => elm && !Dom.isText(elm),
						editor.editor
					) || editor.editor;

			const ideal = editor.createInside.span();

			editor.editor.appendChild(ideal);

			copyStyles.forEach((key: string) => {
				defaultStyles[key] = css(ideal, key);
			});

			if (ideal !== editor.editor) {
				Dom.safeRemove(ideal);
			}

			const format = getStyles(editor, box, defaultStyles);

			const onMouseUp = () => {
				editor.buffer.delete(pluginKey);

				const currentNode = editor.s.current();

				if (currentNode) {
					if (Dom.isTag(currentNode, 'img')) {
						css(currentNode as HTMLElement, format);
					} else {
						editor.s.applyStyle(format);
					}
				}

				editor.e.off(editor.editor, 'mouseup.' + pluginKey);
			};

			editor.e.on(editor.editor, 'mouseup.' + pluginKey, onMouseUp);

			editor.buffer.set(pluginKey, true);
		}

		button.update();
	},

	isActive: (editor: IUnidit) => editor.buffer.exists(pluginKey),

	tooltip: 'Paint format'
} as IControlType;

export function copyFormat(editor: IUnidit): void {
	editor.registerButton({
		name: 'copyformat',
		group: 'clipboard'
	});
}
