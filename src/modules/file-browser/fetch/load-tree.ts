/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/file-browser
 */

import type { IFileBrowser } from 'unidit/types';
import { error } from 'unidit/core/helpers/utils/error';
import { Dom } from 'unidit/core/dom';
import { loadItems } from 'unidit/modules/file-browser/fetch/load-items';

/**
 * Loads a list of directories
 */
export async function loadTree(fb: IFileBrowser): Promise<any> {
	const errorUni = (e: string | Error) => {
		throw e instanceof Error ? e : error(e);
	};

	fb.tree.setMod('active', true);

	Dom.detach(fb.tree.container);

	const items = loadItems(fb);

	if (fb.o.showFoldersPanel) {
		fb.tree.setMod('loading', true);

		const tree = fb.dataProvider
			.tree(fb.state.currentPath, fb.state.currentSource)
			.then(resp => {
				fb.state.sources = resp;
			})
			.catch(e => {
				errorUni(e);
			})
			.finally(() => fb.tree.setMod('loading', false));

		return Promise.all([tree, items]).catch(error);
	}

	fb.tree.setMod('active', false);

	return items.catch(error);
}
