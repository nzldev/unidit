/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/tooltip
 */

import './tooltip.less';

import type { IUnidit, IPoint } from 'unidit/types';
import { css } from 'unidit/core/helpers';
import { Plugin } from 'unidit/core/plugin';
import { Dom } from 'unidit/core/dom';
import { getContainer } from 'unidit/core/global';
import { autobind } from 'unidit/core/decorators';

export class tooltip extends Plugin {
	private isOpened = false;

	container!: HTMLElement;

	afterInit(unidit: IUnidit): void {
		this.container = unidit.c.div('unidit-tooltip');
		getContainer(this.j, tooltip).appendChild(this.container);

		let timeout = 0;

		unidit.e
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(getPoint: () => IPoint, content: string) => {
					unidit.async.clearTimeout(timeout);
					this.open(getPoint, content);
				}
			)

			.on('delayShowTooltip.tooltip', this.delayOpen)

			.on('escape.tooltip', this.close)
			.on(
				'hideTooltip.tooltip change.tooltip scroll.tooltip changePlace.tooltip hidePopup.tooltip closeAllPopups.tooltip',
				() => {
					this.j.async.clearTimeout(this.delayShowTimeout);

					timeout = unidit.async.setTimeout(
						this.close,
						this.j.defaultTimeout
					);
				}
			);
	}

	private delayShowTimeout: number = 0;

	@autobind
	private delayOpen(getPoint: () => IPoint, content: string): void {
		const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

		this.j.async.clearTimeout(this.delayShowTimeout);

		this.delayShowTimeout = this.j.async.setTimeout(
			() => this.open(getPoint, content),
			{
				timeout: to,
				label: 'tooltip'
			}
		);
	}

	private open(getPoint: () => IPoint, content: string): void {
		this.container.classList.add('unidit-tooltip_visible');
		this.container.innerHTML = content;

		this.isOpened = true;
		this.setPosition(getPoint);
	}

	private setPosition(getPoint: () => IPoint) {
		const point = getPoint();

		css(this.container, {
			left: point.x,
			top: point.y
		});
	}

	@autobind
	private close(): void {
		this.j.async.clearTimeout(this.delayShowTimeout);

		if (this.isOpened) {
			this.isOpened = false;
			this.container.classList.remove('unidit-tooltip_visible');

			css(this.container, {
				left: -5000
			});
		}
	}

	beforeDestruct(unidit: IUnidit): void {
		unidit?.e.off('.tooltip');
		this.close();
		Dom.safeRemove(this.container);
	}
}
