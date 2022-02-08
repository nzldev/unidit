/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/html
 */

import { isString } from 'unidit/core/helpers/checker/is-string';
import { $$ } from 'unidit/core/helpers/utils';
import { trim } from 'unidit/core/helpers/string/trim';
import { Dom } from 'unidit/core/dom';
import { attr } from 'unidit/core/helpers/utils';

/**
 * Extract plain text from HTML text
 */
export function stripTags(
	html: string | Node,
	doc: Document = document
): string {
	const tmp = doc.createElement('div');

	if (isString(html)) {
		tmp.innerHTML = html;
	} else {
		tmp.appendChild(html);
	}

	$$('DIV, P, BR, H1, H2, H3, H4, H5, H6, HR', tmp).forEach(p => {
		const pr = p.parentNode;
		if (!pr) {
			return;
		}

		const nx = p.nextSibling;

		if (Dom.isText(nx) && /^\s/.test(nx.nodeValue || '')) {
			return;
		}

		if (nx) {
			pr.insertBefore(doc.createTextNode(' '), nx);
		}
	});

	return trim(tmp.innerText) || '';
}

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(
	box: HTMLElement,
	options: {
		removeOnError: boolean;
		safeJavaScriptLink: boolean;
	}
): void {
	if (!Dom.isElement(box)) {
		return;
	}

	const removeOnError = (elm: HTMLElement) => attr(elm, 'onerror', null),
		safeLink = (elm: HTMLElement) => {
			const href = elm.getAttribute('href');

			if (href && href.trim().indexOf('javascript') === 0) {
				attr(elm, 'href', location.protocol + '//' + href);
			}
		};

	if (options.removeOnError) {
		removeOnError(box);
		$$('[onerror]', box).forEach(removeOnError);
	}

	if (options.safeJavaScriptLink) {
		safeLink(box);
		$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(safeLink);
	}
}
