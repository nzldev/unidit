/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui/form/inputs
 */

import './area.less';

import type { IUITextArea, IViewBased } from 'unidit/types';
import { UIInput } from 'unidit/core/ui/form/inputs/input/input';
import { component } from 'unidit/core/decorators';

@component
export class UITextArea extends UIInput implements IUITextArea {
	/** @override */
	override className(): string {
		return 'UITextArea';
	}

	/** @override */
	static override defaultState: IUITextArea['state'] = {
		...UIInput.defaultState,
		size: 5,
		resizable: true
	};

	override nativeInput!: HTMLTextAreaElement;

	/** @override */
	override state: IUITextArea['state'] = { ...UITextArea.defaultState };

	/** @override */
	protected override createContainer(options: this['state']): HTMLElement {
		this.nativeInput = this.j.create.element('textarea');

		return super.createContainer(options);
	}

	constructor(unidit: IViewBased, state: Partial<IUITextArea['state']>) {
		super(unidit, state);
		Object.assign(this.state, state);

		if (this.state.resizable === false) {
			this.nativeInput.style.resize = 'none';
		}
	}
}
