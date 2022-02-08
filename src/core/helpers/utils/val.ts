/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

export const val = (
	elm: HTMLInputElement | HTMLElement,
	selector: string,
	value?: string | null
): string => {
	const child = elm.querySelector(selector) as HTMLInputElement;

	if (!child) {
		return '';
	}

	if (value) {
		child.value = value;
	}

	return child.value;
};
