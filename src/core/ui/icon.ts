/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui
 */

import type {
	CanUndef,
	IDictionary,
	IUIIconState,
	IViewBased
} from 'unidit/types';
import { css } from 'unidit/core/helpers';

export class Icon {
	private static icons: IDictionary<string> = {};

	private static getIcon(name: string): string | undefined {
		if (/<svg/i.test(name)) {
			return name;
		}

		return (
			Icon.icons[name] ||
			Icon.icons[name.replace(/-/g, '_')] ||
			Icon.icons[name.replace(/_/g, '-')] ||
			Icon.icons[name.toLowerCase()]
		);
	}

	/**
	 * Check if icon exist in store
	 */
	static exists(name: string): boolean {
		return this.getIcon(name) !== undefined;
	}

	/**
	 * Return SVG icon
	 */
	static get(name: string, defaultValue: string = '<span></span>'): string {
		return this.getIcon(name) || defaultValue;
	}

	/**
	 * Set SVG in store
	 */
	static set(name: string, value: string): typeof Icon {
		this.icons[name.replace('_', '-')] = value;
		return this;
	}

	/**
	 * Make icon html element
	 */
	static makeIcon(unidit: IViewBased, icon: IUIIconState): CanUndef<Node> {
		let iconElement: CanUndef<HTMLElement>;

		if (icon) {
			const clearName = icon.name.replace(/[^a-zA-Z0-9]/g, '_');

			if (icon.iconURL) {
				iconElement = unidit.c.span();

				css(
					iconElement,
					'backgroundImage',
					'url(' +
						icon.iconURL.replace(
							'{basePath}',
							unidit?.basePath || ''
						) +
						')'
				);
			} else {
				const svg =
					unidit.e.fire('getIcon', icon.name, icon, clearName) ||
					Icon.get(icon.name, '') ||
					unidit.o.extraIcons?.[icon.name];

				if (svg) {
					iconElement = unidit.c.fromHTML(svg.trim());

					if (!/^<svg/i.test(icon.name)) {
						iconElement.classList.add('unidit-icon_' + clearName);
					}
				}
			}
		}

		if (iconElement) {
			iconElement.classList.add('unidit-icon');
			iconElement.style.fill = icon.fill;
		}

		return iconElement;
	}
}
