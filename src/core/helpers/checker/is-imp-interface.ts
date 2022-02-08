/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

import type { IContainer, IDestructible, IInitable } from 'unidit/types';
import { isFunction } from './is-function';
import { Dom } from 'unidit/core/dom';
import { isVoid } from './is-void';

/**
 * Check value has method init
 */
export function isInitable(value: unknown): value is IInitable {
	return !isVoid(value) && isFunction((value as IInitable).init);
}

/**
 * Check value has method destruct
 */
export function isDestructable(value: unknown): value is IDestructible {
	return !isVoid(value) && isFunction((value as IDestructible).destruct);
}

/**
 * Check value is instant that implements IContainer
 */
export function hasContainer(value: unknown): value is IContainer {
	return !isVoid(value) && Dom.isElement((value as IContainer).container);
}
