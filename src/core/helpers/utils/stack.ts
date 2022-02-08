/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type { CanUndef } from 'unidit/types';

export class LimitedStack<T> {
	private stack: T[] = [];

	constructor(readonly limit: number) {}

	push(item: T): this {
		this.stack.push(item);

		if (this.stack.length > this.limit) {
			this.stack.shift();
		}

		return this;
	}

	pop(): CanUndef<T> {
		return this.stack.pop();
	}

	find(clb: (item: T) => boolean): CanUndef<T> {
		return this.stack.find(clb);
	}
}
