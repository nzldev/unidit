/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module types
 */

import type { IComponent, IDictionary } from './types';

export type DecoratorHandler = <T extends IComponent & IDictionary>(
	target: T,
	propertyKey: string
) => void;
