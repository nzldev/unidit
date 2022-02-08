/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/about
 */

import './about.less';

import type { IControlType, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import { css, isLicense, normalizeLicense } from 'unidit/core/helpers/';
import * as constants from 'unidit/core/constants';
import { Dialog } from 'unidit/modules/dialog';

Config.prototype.controls.about = {
	exec: (editor: IUnidit) => {
		const dialog = new Dialog({
				language: editor.o.language
			}),
			i = editor.i18n.bind(editor);

		dialog
			.setMod('theme', editor.o.theme)
			.setHeader(i('About Unidit'))
			.setContent(
				`<div class="unidit-about">
					<div>${i('Unidit Editor')} v.${editor.getVersion()}</div>
					<div>${i(
						'License: %s',
						!isLicense(editor.o.license)
							? 'MIT'
							: normalizeLicense(editor.o.license)
					)}</div>
					<div>
						<a href="${process.env.HOMEPAGE}" target="_blank">${process.env.HOMEPAGE}</a>
					</div>
					<div>
						<a href="https://nazrul.dev/unidit/doc/" target="_blank">${i(
							"Unidit User's Guide"
						)}</a>
						${i('contains detailed help for using')}
					</div>
					<div>${i(
						'Copyright © Nazrul.dev - Nazrul Islam. All rights reserved.'
					)}</div>
				</div>`
			);

		css(dialog.dialog, {
			minHeight: 200,
			minWidth: 420
		});

		dialog.open(true).bindDestruct(editor);
	},
	tooltip: 'About Unidit',
	mode: constants.MODE_SOURCE + constants.MODE_WYSIWYG
} as IControlType;

export function about(editor: IUnidit): void {
	editor.registerButton({
		name: 'about',
		group: 'info'
	});
}
