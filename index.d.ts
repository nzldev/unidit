/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import type { IComponent, Nullable } from './src/types';
import type { IUnidit } from './src/types';

export * from './src/types';

declare global {
	const Unidit: IUnidit;
	const isProd: boolean;
	const isESNext: boolean;
	const appVersion: string;

	interface HTMLElement {
		component: Nullable<IComponent>;
	}

	interface CaretPosition {
		offsetNode: Node;
		offset: number;
	}

	interface IdleDeadline {
		readonly didTimeout: boolean;
		timeRemaining(): DOMHighResTimeStamp;
	}

	// https://github.com/nzldev/unidit/issues/743
	interface IdleRequestCallback {
		(deadline: IdleDeadline): void;
	}

	interface Document {
		caretPositionFromPoint?(x: number, y: number): CaretPosition;
		caretRangeFromPoint(x: number, y: number): Range;
	}

	// https://github.com/nzldev/unidit/issues/718
	interface ShadowRoot {
		getSelection(): ReturnType<Window['getSelection']>;
	}

	interface Function {
		originalConstructor: Function;
	}
}

export { Unidit };
