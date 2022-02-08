/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { CommitMode, IUnidit } from 'unidit/types';
import type { CommitStyle } from 'unidit/core/selection/style/commit-style';
import {
	attr,
	css,
	dataBind,
	kebabCase,
	normalizeCssValue,
	size
} from 'unidit/core/helpers';
import { Dom } from 'unidit/core/dom';
import { CHANGE, UNSET, UNWRAP } from 'unidit/core/selection/style/commit-style';
import { getContainer } from 'unidit/core/global';

/**
 * Toggles css and classname
 * @private
 */
export function toggleCSS(
	commitStyle: CommitStyle,
	elm: HTMLElement,
	unidit: IUnidit,
	mode: CommitMode,
	dry: boolean = false
): CommitMode {
	const { style, className } = commitStyle.options;

	if (style && size(style) > 0) {
		Object.keys(style).forEach((rule: string) => {
			const inlineValue = elm.style.getPropertyValue(kebabCase(rule));

			if (inlineValue === '' && style[rule] == null) {
				return;
			}

			if (
				getNativeCSSValue(unidit, elm, rule) ===
				normalizeCssValue(rule, style[rule] as string)
			) {
				!dry && css(elm, rule, null);
				mode = UNSET;
				mode = removeExtraCSS(commitStyle, elm, mode);
				return;
			}

			mode = CHANGE;
			!dry && css(elm, rule, style[rule]);
		});
	}

	if (className) {
		if (elm.classList.contains(className)) {
			elm.classList.remove(className);
			mode = UNSET;
		} else {
			elm.classList.add(className);
			mode = CHANGE;
		}
	}

	return mode;
}

/**
 * If the element has an empty style attribute, it removes the attribute,
 * and if it is default, it removes the element itself
 */
function removeExtraCSS(
	commitStyle: CommitStyle,
	elm: HTMLElement,
	mode: CommitMode
): CommitMode {
	if (!attr(elm, 'style')) {
		attr(elm, 'style', null);

		if (elm.tagName.toLowerCase() === commitStyle.defaultTag) {
			Dom.unwrap(elm);
			mode = UNWRAP;
		}
	}

	return mode;
}

/**
 * Creates an iframe into which elements will be inserted to test their default styles in the browser
 */
function getShadowRoot(unidit: IUnidit): HTMLElement {
	if (dataBind(unidit, 'shadowRoot') !== undefined) {
		return dataBind(unidit, 'shadowRoot');
	}

	const container = getContainer(unidit);

	const iframe = document.createElement('iframe');
	css(iframe, {
		width: 0,
		height: 0,
		position: 'absolute',
		border: 0
	});

	iframe.src = 'about:blank';
	container.appendChild(iframe);

	const doc = iframe.contentWindow?.document;

	const shadowRoot = !doc ? unidit.od.body : doc.body;
	dataBind(unidit, 'shadowRoot', shadowRoot);

	return shadowRoot;
}

/**
 * `strong -> fontWeight 700`
 */
function getNativeCSSValue(
	unidit: IUnidit,
	elm: HTMLElement,
	key: string
): ReturnType<typeof css> {
	const newElm = unidit.create.element(elm.tagName.toLowerCase());
	newElm.style.cssText = elm.style.cssText;
	const root = getShadowRoot(unidit);
	root.appendChild(newElm);
	const result = css(newElm, key);
	Dom.safeRemove(newElm);
	return result;
}
