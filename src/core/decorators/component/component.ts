/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/decorators/component/README.md]]
 * @packageDocumentation
 * @module decorators/component
 */

import { isFunction } from 'unidit/core/helpers';

interface ComponentCompatible {
	className?: () => string;
	new (...constructorArgs: any[]): any;
}

/**
 * Safe access to ClassName
 */
const cn = (elm: ComponentCompatible): string | number => {
	return isFunction(elm.className) ? elm.className() : NaN;
};

/**
 * Decorate components and set status isReady after constructor
 * @param constructorFunction - Component constructor class
 */
export function component<T extends ComponentCompatible>(
	constructorFunction: T
): T {
	class newConstructorFunction extends constructorFunction {
		constructor(...args: any[]) {
			super(...args);

			const isSamePrototype =
				Object.getPrototypeOf(this) ===
				newConstructorFunction.prototype;

			/** For strange minimizer */
			const isSameClassName =
				cn(this as unknown as ComponentCompatible) ===
				cn(newConstructorFunction.prototype);

			if (!isProd && isSamePrototype && !isSameClassName) {
				throw new Error('Need use decorator only for components');
			}

			if (isSamePrototype || isSameClassName) {
				this.setStatus('ready');
			}
		}
	}

	newConstructorFunction.prototype.constructor = constructorFunction;

	return newConstructorFunction;
}
