/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/source
 */

import type { CallbackFunction, IUnidit, ISourceEditor } from 'unidit/types';
import { AceEditor, TextAreaEditor } from './engines';
import { isFunction } from 'unidit/core/helpers';

export function createSourceEditor(
	type: 'ace' | 'mirror' | 'area' | ((unidit: IUnidit) => ISourceEditor),
	editor: IUnidit,
	container: HTMLElement,
	toWYSIWYG: CallbackFunction,
	fromWYSIWYG: CallbackFunction
): ISourceEditor {
	let sourceEditor: ISourceEditor;

	if (isFunction(type)) {
		sourceEditor = type(editor);
	} else {
		switch (type) {
			case 'ace':
				if (!editor.o.shadowRoot) {
					sourceEditor = new AceEditor(
						editor,
						container,
						toWYSIWYG,
						fromWYSIWYG
					);
					break;
				}

			default:
				sourceEditor = new TextAreaEditor(
					editor,
					container,
					toWYSIWYG,
					fromWYSIWYG
				);
		}
	}

	sourceEditor.init(editor);
	sourceEditor.onReadyAlways(() => {
		sourceEditor.setReadOnly(editor.o.readonly);
	});

	return sourceEditor;
}
