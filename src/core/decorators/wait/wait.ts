/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/wait/README.md]]
 * @packageDocumentation
 * @module decorators/wait
 */

import type { IViewBased, IViewComponent } from 'unidit/types';
import { error, isFunction, isViewObject } from 'unidit/core/helpers';
import { STATUSES } from 'unidit/core/component';

export function wait<T extends IViewBased>(
	condition: (ctx: T) => boolean
): Function;
export function wait<T extends IViewComponent>(
	condition: (ctx: T) => boolean
): Function;
export function wait<T extends IViewComponent | IViewBased>(
	condition: (ctx: T) => boolean
): Function {
	return (target: T, propertyKey: string) => {
		if (!isFunction((target as any)[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(
			STATUSES.ready,
			(component: IViewBased | IViewComponent) => {
				const async = isViewObject(component)
					? component.async
					: component.j.async;

				const realMethod = (component as any)[propertyKey];

				let timeout: number = 0;

				(component as any)[propertyKey] = function callProxy(
					...args: any[]
				): void {
					async.clearTimeout(timeout);

					if (condition(component as any)) {
						realMethod.apply(component, args);
					} else {
						timeout = async.setTimeout(
							() => callProxy(...args),
							10
						);
					}
				};
			}
		);
	};
}
