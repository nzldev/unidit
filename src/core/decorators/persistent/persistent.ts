/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/persistent/README.md]]
 * @packageDocumentation
 * @module decorators/persistent
 */

import type { IComponent, IDictionary, IViewComponent } from 'unidit/types';
import { STATUSES } from 'unidit/core/component';
import { isViewObject } from 'unidit/core/helpers';

export function persistent<T extends IComponent>(
	target: T,
	propertyKey: string
): void {
	target.hookStatus(STATUSES.ready, (component: T) => {
		const unidit = isViewObject(component)
				? component
				: (component as unknown as IViewComponent).unidit,
			storageKey = `${unidit.options.namespace}${component.componentName}_prop_${propertyKey}`,
			initialValue = (component as IDictionary)[propertyKey];

		Object.defineProperty(component, propertyKey, {
			get() {
				return unidit.storage.get(storageKey) ?? initialValue;
			},
			set(value): void {
				unidit.storage.set(storageKey, value);
			}
		});
	});
}
