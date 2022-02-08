/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { Nullable } from 'unidit/types';
import { Dom } from 'unidit/core/dom';

/**
 * Is normal usual element
 * @private
 */
export function isNormalNode(elm: Nullable<Node>): boolean {
	return Boolean(elm && !Dom.isEmptyTextNode(elm) && !Dom.isTemporary(elm));
}
