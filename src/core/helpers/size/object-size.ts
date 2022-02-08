/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/size
 */

import { isArray, isPlainObject, isString } from '../checker';
import type { CanUndef } from 'unidit/types';

export function size(
	subject: CanUndef<object | string | Array<unknown>>
): number {
	if (isString(subject) || isArray(subject)) {
		return subject.length;
	}

	if (isPlainObject(subject)) {
		return Object.keys(subject).length;
	}

	return 0;
}
