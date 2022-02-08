/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
import type { IUnidit } from 'unidit/types';

/**
 * On Not collapsed selection - should only remove whole selected content
 *
 * @example
 * ```html
 * <p>first | stop</p><p>second | stop</p>
 * ```
 * result
 * ```html
 * <p>first | stop</p>
 * ```
 * @private
 */
export function checkNotCollapsed(unidit: IUnidit): boolean {
	if (!unidit.s.isCollapsed()) {
		unidit.execCommand('Delete');
		return true;
	}

	return false;
}
