/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui/form/block
 */

import './block.less';

import type { IUIElement, IViewBased } from 'unidit/types';
import { UIGroup } from 'unidit/core/ui/group';
import { attr } from 'unidit/core/helpers/utils';
import { component } from 'unidit/core/decorators';

@component
export class UIBlock extends UIGroup {
	/** @override */
	override className(): string {
		return 'UIBlock';
	}

	constructor(
		unidit: IViewBased,
		elements?: Array<IUIElement | void | null | false>,
		override readonly options: {
			align?: 'center' | 'left' | 'right' | 'full';
			width?: 'full';
			ref?: string;
			mod?: string;
		} = {
			align: 'left'
		}
	) {
		super(unidit, elements);

		this.setMod('align', this.options.align || 'left');
		this.setMod('width', this.options.width || '');
		this.options.mod && this.setMod(this.options.mod, true);

		attr(this.container, 'data-ref', options.ref);
		attr(this.container, 'ref', options.ref);
	}
}
