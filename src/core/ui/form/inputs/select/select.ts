/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module ui/form/inputs
 */

import './select.less';

import type { IUISelect, IViewBased } from 'unidit/types';
import { attr } from 'unidit/core/helpers';
import { component } from 'unidit/core/decorators';
import { UIInput } from 'unidit/core/ui/form/inputs/input/input';
import {
	inputValidators,
	selectValidators
} from 'unidit/core/ui/form/validators';

@component
export class UISelect extends UIInput implements IUISelect {
	/** @override */
	override className(): string {
		return 'UISelect';
	}

	/** @override */
	override nativeInput!: IUISelect['nativeInput'];

	/** @override */
	static override defaultState: IUISelect['state'] = {
		...UIInput.defaultState,
		options: [],
		size: 1,
		multiple: false
	};

	/** @override */
	override state: IUISelect['state'] = { ...UISelect.defaultState };

	/** @override **/
	protected override createContainer(
		state: Partial<IUISelect['state']>
	): HTMLElement {
		const container = super.createContainer(state);

		const { j } = this,
			{ nativeInput } = this;

		const opt = () => j.create.element('option');

		if (state.placeholder !== undefined) {
			const option = opt();
			option.value = '';
			option.text = j.i18n(state.placeholder);
			nativeInput.add(option);
		}

		state.options?.forEach(element => {
			const option = opt();
			option.value = element.value.toString();
			option.text = j.i18n(element.text);
			nativeInput.add(option);
		});

		if (state.size && state.size > 0) {
			attr(nativeInput, 'size', state.size);
		}

		if (state.multiple) {
			attr(nativeInput, 'multiple', '');
		}

		return container;
	}

	/** @override **/
	protected override createNativeInput(): IUISelect['nativeInput'] {
		return this.j.create.element('select');
	}

	/** @override **/
	protected override updateValidators(): void {
		super.updateValidators();

		if (this.state.required) {
			this.validators.delete(inputValidators.required);
			this.validators.add(selectValidators.required);
		}
	}

	constructor(unidit: IViewBased, state: Partial<IUISelect['state']>) {
		super(unidit, state);
		Object.assign(this.state, state);
	}
}
