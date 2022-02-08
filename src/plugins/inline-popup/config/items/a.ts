/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { attr } from '../../../../core/helpers/utils';

export default [
	{
		name: 'eye',
		tooltip: 'Open link',
		exec: (editor: IUnidit, current) => {
			const href = attr(current as HTMLElement, 'href');

			if (current && href) {
				editor.ow.open(href);
			}
		}
	},
	{
		name: 'link',
		tooltip: 'Edit link',
		icon: 'pencil'
	},
	'unlink',
	'brush',
	'file'
] as Array<IControlType | string>;
