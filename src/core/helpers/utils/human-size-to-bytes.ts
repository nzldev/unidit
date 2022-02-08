/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

/**
 * Converts from human readable file size (kb,mb,gb,tb) to bytes
 * @param human - readable file size. Example 1gb or 11.2mb
 */
export const humanSizeToBytes = (human: string): number => {
	if (/^[0-9.]+$/.test(human.toString())) {
		return parseFloat(human);
	}

	const format: string = human.substr(-2, 2).toUpperCase(),
		formats: string[] = ['KB', 'MB', 'GB', 'TB'],
		number: number = parseFloat(human.substr(0, human.length - 2));

	return formats.indexOf(format) !== -1
		? number * Math.pow(1024, formats.indexOf(format) + 1)
		: parseInt(human, 10);
};
