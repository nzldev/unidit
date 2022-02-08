/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/source
 */

import type { CallbackFunction, IUnidit } from 'unidit/types';

export abstract class SourceEditor<T> {
	instance!: T;
	className: string = '';

	constructor(
		readonly unidit: IUnidit,
		readonly container: HTMLElement,
		readonly toWYSIWYG: CallbackFunction,
		readonly fromWYSIWYG: CallbackFunction
	) {}

	/**
	 * Short alias for this.unidit
	 */
	get j(): this['unidit'] {
		return this.unidit;
	}

	abstract init(editor: IUnidit): void;
	abstract replaceUndoManager(): void;

	isReady: boolean = false;
	protected onReady(): void {
		this.replaceUndoManager();
		this.isReady = true;
		this.j.e.fire(this, 'ready');
	}

	onReadyAlways(onReady: CallbackFunction): void {
		if (!this.isReady) {
			this.j.events?.on(this, 'ready', onReady);
		} else {
			onReady();
		}
	}
}
