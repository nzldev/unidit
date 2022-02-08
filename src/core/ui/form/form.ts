/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:core/ui/form/README.md]]
 * @packageDocumentation
 * @module ui/form
 */

import type { IDictionary, IUIForm, IUIInput, IUISelect } from 'unidit/types';
import { UIGroup, UIInput, UISelect } from 'unidit/core/ui';
import { attr } from 'unidit/core/helpers/utils';
import { component } from 'unidit/core/decorators';

@component
export class UIForm extends UIGroup implements IUIForm {
	/** @override */
	override className(): string {
		return 'UIForm';
	}

	override container!: HTMLFormElement;

	submit(): void {
		this.j.e.fire(this.container, 'submit');
	}

	validate(): boolean {
		const inputs = this.allChildren.filter(
			elm => elm instanceof UIInput
		) as IUIInput[];

		for (const input of inputs) {
			if (!input.validate()) {
				return false;
			}
		}

		const selects = this.allChildren.filter(
			elm => elm instanceof UISelect
		) as IUISelect[];

		for (const select of selects) {
			if (!select.validate()) {
				return false;
			}
		}

		return true;
	}

	onSubmit(handler: (data: IDictionary) => false | void): void {
		this.j.e.on(this.container, 'submit', (): false => {
			const inputs = this.allChildren.filter(
				elm => elm instanceof UIInput
			) as IUIInput[];

			if (!this.validate()) {
				return false;
			}

			handler(
				inputs.reduce((res, item) => {
					res[item.state.name] = item.value;
					return res;
				}, {} as IDictionary)
			);

			return false;
		});
	}

	/** @override */
	protected override createContainer(): HTMLElement {
		const form = this.j.c.element('form');
		form.classList.add(this.componentName);
		attr(form, 'dir', this.j.o.direction || 'auto');
		return form;
	}

	constructor(...args: ConstructorParameters<typeof UIGroup>) {
		super(...args);

		if (this.options?.className) {
			this.container.classList.add(this.options?.className);
		}
	}
}
