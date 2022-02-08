/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/clipboard/paste
 */

import type { IUnidit, Nullable } from 'unidit/types';
import type { PasteEvent } from 'unidit/plugins/clipboard/config';
import { isArray, isNumber, isString, isVoid } from 'unidit/core/helpers';
import { Dom } from 'unidit/core/dom';
import { TEXT_PLAIN } from 'unidit/core/constants';

/**
 * Get DataTransfer from different event types
 */
export const getDataTransfer = (
	event: ClipboardEvent | DragEvent
): Nullable<DataTransfer> => {
	if ((event as ClipboardEvent).clipboardData) {
		return (event as ClipboardEvent).clipboardData;
	}

	try {
		return (event as DragEvent).dataTransfer || new DataTransfer();
	} catch {
		return null;
	}
};

/**
 * Remove special HTML comments
 */
function removeExtraFragments(html: string): string {
	html = html.replace(/<meta[^>]+?>/g, '');

	const start = html.search(/<!--StartFragment-->/i);

	if (start !== -1) {
		html = html.substr(start + 20);
	}

	const end = html.search(/<!--EndFragment-->/i);

	if (end !== -1) {
		html = html.substr(0, end);
	}

	return html;
}

/**
 * One insert point for clipboard plugins
 */
export function pasteInsertHtml(
	e: Nullable<PasteEvent>,
	editor: IUnidit,
	html: number | string | Node
): void {
	if (editor.isInDestruct) {
		return;
	}

	if (e?.type === 'drop') {
		editor.s.insertCursorAtPoint(
			(e as DragEvent).clientX,
			(e as DragEvent).clientY
		);
	}

	const result = editor.e.fire('beforePasteInsert', html);

	if (
		!isVoid(result) &&
		(isString(result) || isNumber(result) || Dom.isNode(result))
	) {
		html = result;
	}

	if (isString(html)) {
		html = removeExtraFragments(html);
	}

	editor.s.insertHTML(html);
}

/**
 * Return all available data types in event
 */
export function getAllTypes(dt: DataTransfer): string {
	const types: ReadonlyArray<string> | string = dt.types;

	let types_str: string = '';

	if (
		isArray(types) ||
		{}.toString.call(types) === '[object DOMStringList]'
	) {
		for (let i = 0; i < types.length; i += 1) {
			types_str += types[i] + ';';
		}
	} else {
		types_str = (types || TEXT_PLAIN).toString() + ';';
	}

	return types_str;
}
