/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/clipboard
 */

import type { IUnidit, IPlugin } from 'unidit/types';
import type { Plugin } from 'unidit/core/plugin';
import { TEXT_HTML, TEXT_PLAIN } from 'unidit/core/constants';
import { stripTags } from 'unidit/core/helpers';
import { getDataTransfer } from './paste/helpers';

export const pluginKey = 'clipboard';

/**
 * Clipboard plugin - cut and copy functionality
 */
export class clipboard implements IPlugin {
	unidit!: IUnidit;

	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'cut',
			group: 'clipboard'
		},
		{
			name: 'copy',
			group: 'clipboard'
		},
		{
			name: 'paste',
			group: 'clipboard'
		},
		{
			name: 'selectall',
			group: 'clipboard'
		}
	];

	init(editor: IUnidit): void {
		this.buttons?.forEach(btn => editor.registerButton(btn));

		editor.e
			.off(`copy.${pluginKey} cut.${pluginKey}`)
			.on(
				`copy.${pluginKey} cut.${pluginKey}`,
				(event: ClipboardEvent): false | void => {
					const selectedText = editor.s.html;

					const clipboardData =
						getDataTransfer(event) ||
						getDataTransfer(editor.ew as any) ||
						getDataTransfer((event as any).originalEvent);

					if (clipboardData) {
						clipboardData.setData(
							TEXT_PLAIN,
							stripTags(selectedText)
						);
						clipboardData.setData(TEXT_HTML, selectedText);
					}

					editor.buffer.set(pluginKey, selectedText);
					editor.e.fire('pasteStack', {
						html: selectedText,
						action: editor.o.defaultActionOnPaste
					});

					if (event.type === 'cut') {
						editor.s.remove();
						editor.s.focus();
					}

					event.preventDefault();

					editor?.events?.fire('afterCopy', selectedText);
				}
			);
	}

	/** @override */
	destruct(editor: IUnidit): void {
		editor?.buffer?.set(pluginKey, '');
		editor?.events?.off('.' + pluginKey);
	}
}
