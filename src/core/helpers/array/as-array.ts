/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/array
 */

import { isArray } from '../checker/is-array';

/**
 * Always return Array
 */
export const asArray = <T>(a: T[] | T): T[] => (isArray(a) ? a : [a]);
