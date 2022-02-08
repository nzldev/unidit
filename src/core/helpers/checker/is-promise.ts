/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/checker
 */

export function isPromise(val: any | Promise<any>): val is Promise<any> {
	return val && typeof (val as Promise<any>).then === 'function';
}