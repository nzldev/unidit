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
	ButtonsGroup,
	ButtonsGroups,
	IControlType,
	IUnidit
} from 'unidit/types';
import { isArray } from 'unidit/core/helpers/checker';

export const isButtonGroup = (
	item: ButtonsGroup | string | IControlType
): item is ButtonsGroup => {
	return isArray((<ButtonsGroup>item).buttons);
};

export function flatButtonsSet(
	buttons: ButtonsGroups,
	unidit: IUnidit
): Set<string | IControlType> {
	const groups = unidit.getRegisteredButtonGroups();

	return new Set(
		buttons.reduce(
			(acc: Buttons, item: ButtonsGroup | string | IControlType) => {
				if (isButtonGroup(item)) {
					acc = acc.concat([
						...(<ButtonsGroup>item).buttons,
						...(groups[item.group] ?? [])
					]);
				} else {
					acc.push(item);
				}

				return acc;
			},
			[] as Buttons
		)
	);
}
