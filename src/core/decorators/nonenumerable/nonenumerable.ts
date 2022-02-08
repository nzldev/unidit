/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/nonenumerable/README.md]]
 * @packageDocumentation
 * @module decorators/nonenumerable
 */

export const nonenumerable = (target: object, propertyKey: string): void => {
	const descriptor =
		Object.getOwnPropertyDescriptor(target, propertyKey) || {};

	if (descriptor.enumerable !== false) {
		Object.defineProperty(target, propertyKey, {
			enumerable: false,
			set(value: any) {
				Object.defineProperty(this, propertyKey, {
					enumerable: false,
					writable: true,
					value
				});
			}
		});
	}
};
