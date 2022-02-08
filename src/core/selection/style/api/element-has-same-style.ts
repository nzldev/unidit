/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IStyle } from 'unidit/types';
import { css, isVoid, normalizeCssValue } from 'unidit/core/helpers';
import { Dom } from 'unidit/core/dom';

/**
 * Element has the same styles as in the commit
 * @private
 */
export function elementHasSameStyle(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(property => {
				const value = css(elm, property, true);

				return (
					!isVoid(value) &&
					value !== '' &&
					!isVoid(rules[property]) &&
					normalizeCssValue(property, rules[property] as string)
						.toString()
						.toLowerCase() === value.toString().toLowerCase()
				);
			})
	);
}

/**
 * Element has the similar styles
 */
export function elementHasSameStyleKeys(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(
				property => !isVoid(css(elm, property, true))
			)
	);
}
