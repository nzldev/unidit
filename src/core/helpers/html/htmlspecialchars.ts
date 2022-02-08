/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/html
 */

/**
 * Convert special characters to HTML entities
 */
export function htmlspecialchars(html: string): string {
	const tmp = document.createElement('div');
	tmp.textContent = html;
	return tmp.innerHTML;
}
