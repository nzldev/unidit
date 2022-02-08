/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module component
 */

import type { IViewBased, IViewComponent } from 'unidit/types';
import { Component } from './component';

export abstract class ViewComponent<T extends IViewBased = IViewBased>
	extends Component
	implements IViewComponent<T>
{
	/**
	 * Parent View element
	 */
	unidit!: T;

	get defaultTimeout(): number {
		return this.j.defaultTimeout;
	}

	/**
	 * Shortcut for `this.unidit`
	 */
	get j(): T {
		return this.unidit;
	}

	i18n(text: string, ...params: Array<string | number>): string {
		return this.j.i18n(text, ...params);
	}

	/**
	 * Attach component to View
	 */
	setParentView(unidit: T): this {
		this.unidit = unidit;

		unidit.components.add(this);

		return this;
	}

	constructor(unidit: T) {
		super();
		this.setParentView(unidit);
	}

	/** @override */
	override destruct(): any {
		this.j.components.delete(this);
		return super.destruct();
	}
}
