/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:modules/status-bar/README.md]]
 * @packageDocumentation
 * @module modules/status-bar
 */

import './status-bar.less';

import type { IUnidit, IStatusBar, IDictionary, ModType } from 'unidit/types';
import { ViewComponent, STATUSES } from 'unidit/core/component';
import { Dom } from 'unidit/core/dom';
import { Mods } from 'unidit/core/traits';

export class StatusBar extends ViewComponent<IUnidit> implements IStatusBar {
	className(): string {
		return 'StatusBar';
	}

	container!: HTMLDivElement;

	/**
	 * Hide statusbar
	 */
	hide(): void {
		this.container.classList.add('unidit_hidden');
	}

	/**
	 * Show statusbar
	 */
	show(): void {
		this.container.classList.remove('unidit_hidden');
	}

	/**
	 * Status bar is shown
	 */
	get isShown(): boolean {
		return !this.container.classList.contains('unidit_hidden');
	}

	readonly mods: IDictionary<ModType> = {};

	/** @see [[Mods.setMod]] */
	setMod(name: string, value: ModType): this {
		Mods.setMod.call(this, name, value);
		return this;
	}

	/** @see [[Mods.getMod]] */
	getMod(name: string): ModType {
		return Mods.getMod.call(this, name);
	}

	/**
	 * Height of statusbar
	 */
	getHeight(): number {
		return this.container?.offsetHeight ?? 0;
	}

	private findEmpty(inTheRight: boolean = false): HTMLDivElement | void {
		const items = this.container?.querySelectorAll(
			'.unidit-status-bar__item' +
				(inTheRight ? '.unidit-status-bar__item-right' : '')
		);

		if (items) {
			for (let i = 0; i < items.length; i += 1) {
				if (!items[i].innerHTML.trim().length) {
					return items[i] as HTMLDivElement;
				}
			}
		}
	}

	/**
	 * Add element in statusbar
	 */
	append(child: HTMLElement, inTheRight: boolean = false): void {
		const wrapper =
			this.findEmpty(inTheRight) ||
			this.j.c.div('unidit-status-bar__item');

		if (inTheRight) {
			wrapper.classList.add('unidit-status-bar__item-right');
		}

		wrapper.appendChild(child);

		this.container?.appendChild(wrapper);

		if (this.j.o.statusbar) {
			this.show();
		}

		this.j.e.fire('resize');
	}

	constructor(unidit: IUnidit, readonly target: HTMLElement) {
		super(unidit);

		this.container = unidit.c.div('unidit-status-bar');

		target.appendChild(this.container);
		this.hide();
	}

	override destruct(): void {
		this.setStatus(STATUSES.beforeDestruct);
		Dom.safeRemove(this.container);
		super.destruct();
	}
}
