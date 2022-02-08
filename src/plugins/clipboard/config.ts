/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/clipboard
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import {
	INSERT_AS_HTML,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	INSERT_AS_TEXT,
	TEXT_PLAIN
} from 'unidit/core/constants';
import { Alert } from 'unidit/modules/dialog';
import { pasteInsertHtml } from './paste/helpers';
import { pluginKey as clipboardPluginKey } from './clipboard';

export type PasteEvent = ClipboardEvent | DragEvent;

export type InsertMode =
	| typeof INSERT_AS_HTML
	| typeof INSERT_CLEAR_HTML
	| typeof INSERT_ONLY_TEXT
	| typeof INSERT_AS_TEXT;

declare module 'unidit/config' {
	interface Config {
		/**
		 * Ask before paste HTML in WYSIWYG mode
		 */
		askBeforePasteHTML: boolean;

		/**
		 * When the user inserts a piece of HTML, the plugin will ask - How to insert it.
		 * If after that user insert the same fragment again, the previous option will be used without extra question.
		 */
		memorizeChoiceWhenPasteFragment: boolean;

		/**
		 * Handle pasted text - similar to HTML
		 */
		processPasteHTML: boolean;

		/**
		 * Show the paste dialog if the html is similar to what MSWord gives when copying.
		 */
		askBeforePasteFromWord: boolean;

		/**
		 * Handle pasting of HTML - similar to a fragment copied from MSWord
		 */
		processPasteFromWord: boolean;

		/**
		 * Inserts HTML line breaks before all newlines in a string
		 */
		nl2brInPlainText: boolean;

		/**
		 * Default insert method
		 */
		defaultActionOnPaste: InsertMode;

		/**
		 * Default insert method from word, if not define, it will use defaultActionOnPaste instead
		 * @example
		 * ```js
		 * Unidit.make('#editor', {
		 *   defaultActionOnPasteFromWord: 'insert_clear_html'
		 * })
		 * ```
		 */
		defaultActionOnPasteFromWord: InsertMode | null;

		/**
		 * Draggable elements
		 */
		draggableTags: string | string[];
	}
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.processPasteHTML = true;

Config.prototype.askBeforePasteFromWord = true;
Config.prototype.memorizeChoiceWhenPasteFragment = false;
Config.prototype.processPasteFromWord = true;

Config.prototype.nl2brInPlainText = true;
Config.prototype.defaultActionOnPaste = INSERT_AS_HTML;
Config.prototype.defaultActionOnPasteFromWord = null;

Config.prototype.draggableTags = ['img', 'a', 'unidit-media', 'unidit'];

Config.prototype.controls.cut = {
	command: 'cut',
	isDisabled: (editor: IUnidit) => editor.s.isCollapsed(),
	tooltip: 'Cut selection'
} as IControlType;

Config.prototype.controls.copy = {
	command: 'copy',
	isDisabled: (editor: IUnidit) => editor.s.isCollapsed(),
	tooltip: 'Copy selection'
} as IControlType;

const psKey = 'pasteStorage';

Config.prototype.controls.paste = {
	tooltip: 'Paste from clipboard',

	async exec(editor: IUnidit, _, { control }) {
		if (control.name === psKey) {
			editor.execCommand('showPasteStorage');
			return;
		}

		editor.s.focus();

		let text = '',
			error = true;

		if (navigator.clipboard) {
			try {
				const items = await (navigator.clipboard as any).read();

				if (items && items.length) {
					const textBlob = await items[0].getType(TEXT_PLAIN);
					text = await new Response(textBlob).text();
				}

				error = false;
			} catch (e) {
				if (!isProd) {
					console.log(e);
				}
			}

			if (error) {
				try {
					text = await navigator.clipboard.readText();
					error = false;
				} catch (e) {
					if (!isProd) {
						console.log(e);
					}
				}
			}
		}

		if (error) {
			text = editor.buffer.get<string>(clipboardPluginKey) || '';
			error = text.length === 0;
		}

		const value = editor.value;

		if (error) {
			editor.ed.execCommand('paste');
			error = value === editor.value;
			!error && editor.e.fire('afterPaste');
		} else if (text.length) {
			pasteInsertHtml(null, editor, text);
			editor.e.fire('afterPaste');
		} else {
			if (error) {
				Alert(
					editor.i18n(
						"Your browser doesn't support direct access to the clipboard."
					),
					() => {
						editor.s.focus();
					}
				).bindDestruct(editor);
			}
		}
	},

	list: {
		[psKey]: 'Paste Storage'
	},

	isChildDisabled(j): boolean {
		return j.e.fire('pasteStorageList') < 2;
	}
} as IControlType;

Config.prototype.controls.selectall = {
	icon: 'select-all',
	command: 'selectall',
	tooltip: 'Select all'
} as IControlType;
