/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/media
 */

import type {
	IControlType,
	IFileBrowserCallBackData,
	IUnidit
} from 'unidit/types';
import { Config } from 'unidit/config';
import { Dom } from 'unidit/core/dom';
import { FileSelectorWidget } from 'unidit/modules/widget';

Config.prototype.controls.file = {
	popup: (
		editor: IUnidit,
		current: Node | false,
		self: IControlType,
		close
	) => {
		const insert = (url: string, title: string = '') => {
			editor.s.insertNode(
				editor.createInside.fromHTML(
					`<a href="${url}" title="${title}">${title || url}</a>`
				)
			);
		};

		let sourceAnchor: HTMLAnchorElement | null = null;

		if (
			current &&
			(Dom.isTag(current, 'a') ||
				Dom.closest(current, 'a', editor.editor))
		) {
			sourceAnchor = Dom.isTag(current, 'a')
				? current
				: (Dom.closest(
						current,
						'a',
						editor.editor
				  ) as HTMLAnchorElement);
		}

		return FileSelectorWidget(
			editor,
			{
				filebrowser: (data: IFileBrowserCallBackData) => {
					data.files &&
						data.files.forEach(file => insert(data.baseurl + file));

					close();
				},
				upload: true,
				url: (url: string, text: string) => {
					if (sourceAnchor) {
						sourceAnchor.setAttribute('href', url);
						sourceAnchor.setAttribute('title', text);
					} else {
						insert(url, text);
					}
					close();
				}
			},
			sourceAnchor,
			close,
			false
		);
	},
	tags: ['a'],
	tooltip: 'Insert file'
} as IControlType;

export function file(editor: IUnidit): void {
	editor.registerButton({
		name: 'file',
		group: 'media'
	});
}
