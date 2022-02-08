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
 * Loads a list of files and adds them to the state
 */
export async function loadItems(fb: IFileBrowser): Promise<any> {
	fb.files.setMod('active', true);
	fb.files.setMod('loading', true);

	return fb.dataProvider
		.items(fb.state.currentPath, fb.state.currentSource, {
			sortBy: fb.state.sortBy,
			onlyImages: fb.state.onlyImages,
			filterWord: fb.state.filterWord
		})
		.then(resp => {
			fb.state.elements = resp;
			fb.state.activeElements = [];
		})
		.catch(fb.status)
		.finally(() => fb.files.setMod('loading', false));
}
