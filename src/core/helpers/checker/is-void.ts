/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

/**
 * Check value is undefined or null
 */
export function isVoid(value: unknown): value is undefined | null {
	// eslint-disable-next-line eqeqeq
	return value === undefined || value === null;
}
