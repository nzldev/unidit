/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/size
 */

import type { IBound, IViewBased } from 'unidit/types';
import { isUniditObject } from '../checker';

export function position(elm: HTMLElement): IBound;
export function position(elm: HTMLElement, unidit: IViewBased): IBound;
export function position(
	elm: HTMLElement,
	unidit: IViewBased,
	recurse: boolean
): IBound;

/**
 * Calculate screen element position
 */
export function position(
	elm: HTMLElement,
	unidit?: IViewBased,
	recurse: boolean = false
): IBound {
	const rect = elm.getBoundingClientRect();

	let xPos = rect.left,
		yPos = rect.top;

	if (isUniditObject(unidit) && unidit.iframe && !recurse) {
		const { left, top } = position(unidit.iframe, unidit, true);

		xPos += left;
		yPos += top;
	}

	return {
		left: Math.round(xPos),
		top: Math.round(yPos),
		width: Math.round(elm.offsetWidth),
		height: Math.round(elm.offsetHeight)
	};
}
