/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

class AssertionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AssertionError';
	}
}

/** Asserts that condition is truthy (or evaluates to true). */
function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new AssertionError(`Assertion failed: ${message}`);
	}
}

export { assert };
