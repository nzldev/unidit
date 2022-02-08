/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/ui/progress-bar/README.md]]
 * @packageDocumentation
 * @module ui/progress-bar
 */

import './progress-bar.less';

import type { IUnidit, IProgressBar } from 'unidit/types';
import { Dom } from 'unidit/core/dom';
import { UIElement } from '../element';

export class ProgressBar extends UIElement implements IProgressBar {
	/** @override */
	override className(): string {
		return 'ProgressBar';
	}

	/** @override */
	protected override render(): string {
		return '<div><div></div></div>';
	}

	/**
	 * Show progress bar
	 */
	show(): IProgressBar {
		const container = (this.j as IUnidit).workplace || this.j.container;
		container.appendChild(this.container);
		return this;
	}

	hide(): IProgressBar {
		Dom.safeRemove(this.container);
		return this;
	}

	progress(percentage: number): IProgressBar {
		this.container.style.width = percentage.toFixed(2) + '%';
		return this;
	}

	override destruct(): any {
		this.hide();
		return super.destruct();
	}
}
