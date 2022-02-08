/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/class-span
 */

import type { IControlType, IUnidit } from 'unidit/types';
import { Plugin } from 'unidit/core/plugin';
import { Config } from 'unidit/config';
import { Dom } from 'unidit/core/dom';
import { memorizeExec } from 'unidit/core/helpers';

Config.prototype.controls.classSpan = {
	command: 'applyClassName',

	icon: require('./icon.svg'),

	exec: memorizeExec,

	list: [
		'enabled',
		'disabled',
		'activated',
		'text-left',
		'text-center',
		'text-right',
		'warning',
		'error'
	],

	isChildActive: (editor: IUnidit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					Dom.isElement,
					editor.editor
				) as HTMLElement) || editor.editor;

			return Boolean(
				control.args &&
					currentBpx.classList.contains(control.args[0].toString())
			);
		}

		return false;
	},

	isActive: (editor: IUnidit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					Dom.isElement,
					editor.editor
				) as HTMLElement) || editor.editor;

			let present: boolean = false;

			control.list &&
				Object.keys(control.list).forEach((className: string) => {
					if (currentBpx.classList.contains(className)) {
						present = true;
					}
				});

			return Boolean(
				currentBpx &&
					currentBpx !== editor.editor &&
					control.list !== undefined &&
					present
			);
		}

		return false;
	},

	childTemplate: (e: IUnidit, key: string, value: string) =>
		`<span class="${key}">${e.i18n(value)}</span>`,

	tooltip: 'Insert className'
} as IControlType;

/**
 * Applying some className to selected text.
 * @example
 * ```js
 * const editor = new Unidit('#editor', {
 *	controls: {
 *		classSpan: {
 *			list: {
 *				class1: 'Classe 1',
 *				class2: 'Classe 2',
 *				class3: 'Classe 3',
 *				class4: 'Classe 4',
 *				class5: 'Classe 5'
 *			}
 *		}
 *	}
 * });
 * ```
 */
export class classSpan extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'classSpan',
			group: 'font'
		}
	];

	/** @override */
	protected override afterInit(unidit: IUnidit): void {
		unidit.registerCommand(
			'applyClassName',
			(command: string, second: string, third: string): false => {
				unidit.s.applyStyle(undefined, {
					className: third
				});

				return false;
			}
		);
	}

	/** @override */
	protected override beforeDestruct(): void {}
}
