/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/plugin/README.md]]
 * @packageDocumentation
 * @module plugin
 */

import type { IUnidit, IPlugin, IViewBased } from 'unidit/types';
import { ViewComponent, STATUSES } from '../component';
import { autobind } from 'unidit/core/decorators';
import { isUniditObject } from 'unidit/core/helpers';

export abstract class Plugin<T extends IViewBased = IUnidit>
	extends ViewComponent<T>
	implements IPlugin<T>
{
	requires: string[] = [];

	/** @override */
	buttons: IPlugin['buttons'] = [];

	/**
	 * Plugin have CSS style and it should be loaded
	 */
	hasStyle: boolean = false;

	/** @override */
	className(): string {
		return '';
	}

	protected abstract afterInit(unidit: T): void;
	protected abstract beforeDestruct(unidit: T): void;

	constructor(unidit: T) {
		super(unidit);

		unidit.e
			.on('afterPluginSystemInit', () => {
				if (isUniditObject(unidit)) {
					this.buttons?.forEach(btn => {
						unidit.registerButton(btn);
					});
				}
			})
			.on('afterInit', () => {
				this.setStatus(STATUSES.ready);
				this.afterInit(unidit);
			})
			.on('beforeDestruct', this.destruct);
	}

	init(unidit: T): void {
		// empty
	}

	@autobind
	override destruct(): void {
		if (!this.isInDestruct) {
			this.setStatus(STATUSES.beforeDestruct);

			const { j } = this;

			if (isUniditObject(j)) {
				this.buttons?.forEach(btn => {
					j?.unregisterButton(btn);
				});
			}

			this.j?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.j);
			super.destruct();
		}
	}
}
