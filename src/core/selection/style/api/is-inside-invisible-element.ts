/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import { Dom } from 'unidit/core/dom';

/**
 * Check if FONT inside STYLE or SCRIPT element
 * @private
 */
export function isInsideInvisibleElement(
	font: HTMLElement,
	root: HTMLElement
): boolean {
	return Boolean(Dom.closest(font, ['style', 'script'], root));
}
