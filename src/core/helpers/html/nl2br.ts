/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/html
 */

/**
 *  Inserts HTML line breaks before all newlines in a string
 */
export function nl2br(html: string): string {
	return html.replace(/\r\n|\r|\n/g, '<br/>');
}
