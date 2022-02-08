/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui/group
 */

import { UIElement } from 'unidit/core/ui/element';
import { component } from 'unidit/core/decorators';

@component
export class UISeparator extends UIElement {
	override className(): string {
		return 'UISeparator';
	}
}
