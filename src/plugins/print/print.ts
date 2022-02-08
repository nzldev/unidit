/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/print
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import { getContainer } from 'unidit/core/global';
import { Dom } from 'unidit/core/dom';
import { defaultLanguage } from 'unidit/core/helpers';
import * as consts from 'unidit/core/constants';

Config.prototype.controls.print = {
	exec: (editor: IUnidit) => {
		const iframe = editor.create.element('iframe');

		Object.assign(iframe.style, {
			position: 'fixed',
			right: 0,
			bottom: 0,
			width: 0,
			height: 0,
			border: 0
		});

		getContainer(editor, Config).appendChild(iframe);

		const afterFinishPrint = () => {
			editor.e.off(editor.ow, 'mousemove', afterFinishPrint);
			Dom.safeRemove(iframe);
		};

		const mywindow = iframe.contentWindow;
		if (mywindow) {
			editor.e
				.on(mywindow, 'onbeforeunload onafterprint', afterFinishPrint)
				.on(editor.ow, 'mousemove', afterFinishPrint);

			if (editor.o.iframe) {
				editor.e.fire(
					'generateDocumentStructure.iframe',
					mywindow.document,
					editor
				);

				mywindow.document.body.innerHTML = editor.value;
			} else {
				mywindow.document.write(
					'<!doctype html><html lang="' +
						defaultLanguage(editor.o.language) +
						'"><head><title></title></head>' +
						'<body>' +
						editor.value +
						'</body></html>'
				);
				mywindow.document.close();
			}

			mywindow.focus();
			mywindow.print();
		}
	},
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	tooltip: 'Print'
} as IControlType;

export function print(editor: IUnidit): void {
	editor.registerButton({
		name: 'print'
	});
}
