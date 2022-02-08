/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/table
 */

import type { IUnidit } from 'unidit/types';

export function table(editor: IUnidit): void {
	editor.registerButton({
		name: 'table',
		group: 'insert'
	});
}
