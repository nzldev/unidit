/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/sticky
 */

import './sticky.less';

import type { IBound, IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import { IS_IE, MODE_WYSIWYG } from 'unidit/core/constants';
import { Plugin, Dom } from '../../modules';
import { css, offset } from 'unidit/core/helpers';
import { throttle } from 'unidit/core/decorators';

declare module 'unidit/config' {
	interface Config {
		/**
		 * @example
		 * ```javascript
		 * var editor = new Unidit('#someid', {
		 *  toolbarSticky: false
		 * })
		 * ```
		 */
		toolbarSticky: boolean;

		toolbarDisableStickyForMobile: boolean;

		/**
		 * For example, in Joomla, the top menu bar closes Unidit toolbar when scrolling. Therefore, it is necessary to
		 * move the toolbar Unidit by this amount [more](http://nazrul.dev/pacakges/unidit/doc/#2.5.57)
		 *
		 * @example
		 * ```javascript
		 * var editor = new Unidit('#someid', {
		 *  toolbarStickyOffset: 100
		 * })
		 * ```
		 */
		toolbarStickyOffset: number;
	}
}

Config.prototype.toolbarSticky = true;
Config.prototype.toolbarDisableStickyForMobile = true;
Config.prototype.toolbarStickyOffset = 0;

export class sticky extends Plugin {
	private isToolbarSticked: boolean = false;
	private dummyBox?: HTMLElement;

	private createDummy = (toolbar: HTMLElement) => {
		if (!isESNext && IS_IE && !this.dummyBox) {
			this.dummyBox = this.j.c.div();
			this.dummyBox.classList.add('unidit_sticky-dummy_toolbar');
			this.j.container.insertBefore(this.dummyBox, toolbar);
		}
	};

	/**
	 * Add sticky
	 */
	addSticky = (toolbar: HTMLElement): void => {
		if (!this.isToolbarSticked) {
			this.createDummy(toolbar);
			this.j.container.classList.add('unidit_sticky');

			this.isToolbarSticked = true;
		}

		// on resize it should work always
		css(toolbar, {
			top: this.j.o.toolbarStickyOffset || null,
			width: this.j.container.offsetWidth - 2
		});

		if (!isESNext && IS_IE && this.dummyBox) {
			css(this.dummyBox, {
				height: toolbar.offsetHeight
			});
		}
	};

	/**
	 * Remove sticky behaviour
	 */
	removeSticky = (toolbar: HTMLElement): void => {
		if (this.isToolbarSticked) {
			css(toolbar, {
				width: '',
				top: ''
			});

			this.j.container.classList.remove('unidit_sticky');
			this.isToolbarSticked = false;
		}
	};

	afterInit(unidit: IUnidit): void {
		unidit.e
			.on(
				unidit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.onScroll
			)
			.on('getStickyState.sticky', () => this.isToolbarSticked);
	}

	/**
	 * Scroll handler
	 */
	@throttle()
	private onScroll(): void {
		const { unidit } = this;

		const scrollWindowTop: number =
				unidit.ow.pageYOffset ||
				(unidit.od.documentElement &&
					unidit.od.documentElement.scrollTop) ||
				0,
			offsetEditor: IBound = offset(
				unidit.container,
				unidit,
				unidit.od,
				true
			),
			doSticky: boolean =
				unidit.getMode() === MODE_WYSIWYG &&
				scrollWindowTop + unidit.o.toolbarStickyOffset >
					offsetEditor.top &&
				scrollWindowTop + unidit.o.toolbarStickyOffset <
					offsetEditor.top + offsetEditor.height &&
				!(unidit.o.toolbarDisableStickyForMobile && this.isMobile());

		if (
			unidit.o.toolbarSticky &&
			unidit.o.toolbar === true &&
			this.isToolbarSticked !== doSticky
		) {
			const container = unidit.toolbarContainer;

			if (container) {
				doSticky
					? this.addSticky(container)
					: this.removeSticky(container);
			}

			unidit.e.fire('toggleSticky', doSticky);
		}
	}

	/**
	 * Is mobile device
	 */
	private isMobile(): boolean {
		return (
			this.j &&
			this.j.options &&
			this.j.container &&
			this.j.o.sizeSM >= this.j.container.offsetWidth
		);
	}

	/** @override */
	beforeDestruct(unidit: IUnidit): void {
		this.dummyBox && Dom.safeRemove(this.dummyBox);
		unidit.e
			.off(
				unidit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.onScroll
			)
			.off('.sticky');
	}
}
