/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/idle/README.md]]
 * @packageDocumentation
 * @module decorators/idle
 */

import type {
	DecoratorHandler,
	IDictionary,
	IViewBased,
	IViewComponent
} from 'unidit/types';
import { Component, STATUSES } from 'unidit/core/component';
import { error, isFunction, isViewObject } from 'unidit/core/helpers';

export function idle<V = IViewComponent | IViewBased>(): DecoratorHandler {
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

			const originalMethod = (component as any)[propertyKey];

			(component as any)[propertyKey] = (...args: unknown[]) =>
				view.async.requestIdleCallback(
					originalMethod.bind(component, ...args)
				);
		});
	};
}
