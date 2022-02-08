/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/debounce/README.md]]
 * @packageDocumentation
 * @module decorators/debounce
 */

import type {
	IDictionary,
	IViewBased,
	IViewComponent,
	IAsyncParams,
	DecoratorHandler
} from 'unidit/types';
import {
	isFunction,
	isNumber,
	isPlainObject,
	isViewObject
} from 'unidit/core/helpers/checker';
import { Component, STATUSES } from 'unidit/core/component';
import { error } from 'unidit/core/helpers/utils/error';

export function debounce<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false,
	method: 'debounce' | 'throttle' = 'debounce'
): DecoratorHandler {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): void => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(STATUSES.ready, (component: V) => {
			const view = isViewObject(component)
				? component
				: (component as unknown as IViewComponent).unidit;

			const realTimeout = isFunction(timeout)
				? timeout(component)
				: timeout;

			(component as any)[propertyKey] = view.async[method](
				(component as any)[propertyKey].bind(component),
				isNumber(realTimeout) || isPlainObject(realTimeout)
					? realTimeout
					: view.defaultTimeout,
				firstCallImmediately
			);
		});
	};
}

/**
 * Wrap function in throttle wrapper
 */
export function throttle<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false
): DecoratorHandler {
	return debounce<V>(timeout, firstCallImmediately, 'throttle');
}
