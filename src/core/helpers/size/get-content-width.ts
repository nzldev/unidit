/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/size
 */

export const getContentWidth = (element: HTMLElement, win: Window): number => {
	const pi = (value: string): number => parseInt(value, 10),
		style: CSSStyleDeclaration = win.getComputedStyle(element),
		width: number = element.offsetWidth,
		paddingLeft: number = pi(style.getPropertyValue('padding-left') || '0'),
		paddingRight: number = pi(
			style.getPropertyValue('padding-right') || '0'
		);

	return width - paddingLeft - paddingRight;
};
