/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { align } from './img';

export default [
	{
		name: 'bin',
		tooltip: 'Delete',
		exec: (editor: IUnidit, image) => {
			image && editor.s.removeNode(image);
		}
	},
	align
] as Array<IControlType | string>;
