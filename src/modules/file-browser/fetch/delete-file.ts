/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/file-browser
 */

import type { IFileBrowser } from 'unidit/types';

/**
 * Removes a file from the server
 */
export function deleteFile(
	fb: IFileBrowser,
	name: string,
	source: string
): Promise<void> {
	return fb.dataProvider
		.fileRemove(fb.state.currentPath, name, source)
		.then(message => {
			fb.status(message || fb.i18n('File "%s" was deleted', name), true);
		})
		.catch(fb.status);
}
