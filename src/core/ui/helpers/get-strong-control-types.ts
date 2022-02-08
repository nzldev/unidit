/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui
 */

import type {
	Buttons,
	Controls,
	IControlTypeStrong,
	IDictionary
} from 'unidit/types';
import { getControlType } from './get-control-type';
import { Config } from 'unidit/config';
import { isArray } from 'unidit/core/helpers/checker';
import { ConfigProto, keys } from 'unidit/core/helpers';

export function getStrongControlTypes(
	items: Buttons | IDictionary<string>,
	controls?: Controls
): IControlTypeStrong[] {
	const elements = isArray(items)
		? items
		: keys(items, false).map(key => {
				const value = items[key] || {};
				return ConfigProto({ name: key }, value) as IControlTypeStrong;
		  });

	return elements.map(item =>
		getControlType(item, controls || Config.defaultOptions.controls)
	);
}
