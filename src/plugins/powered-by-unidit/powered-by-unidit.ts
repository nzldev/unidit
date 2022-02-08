/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/powered-by-unidit
 */

import type { IUnidit } from 'unidit/types';

declare module 'unidit/config' {
	interface Config {
		/**
		 * Hide the link to the Unidit site at the bottom of the editor
		 */
		hidePoweredByUnidit: boolean;
	}
}

export function poweredByUnidit(unidit: IUnidit): void {
	if (
		!unidit.o.hidePoweredByUnidit &&
		!unidit.o.inline &&
		(unidit.o.showCharsCounter ||
			unidit.o.showWordsCounter ||
			unidit.o.showXPathInStatusbar)
	) {
		unidit.hookStatus('ready', () => {
			unidit.statusbar.append(
				unidit.create.fromHTML(
					`<a
						tabindex="-1"
						style="text-transform: uppercase"
						class="unidit-status-bar-link"
						target="_blank"
						href="https://m4yours.com/">
							Powered by M4Yours
						</a>`
				),
				true
			);
		});
	}
}
