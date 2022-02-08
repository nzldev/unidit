/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/dialog
 */

import { Dialog } from 'unidit/modules/dialog';
import { Button } from 'unidit/core/ui';
import { attr, isFunction } from 'unidit/core/helpers';

/**
 * Show `Prompt` dialog. Work without Unidit object
 *
 * @param title - Title or callback
 * @param callback - callback. The first argument is the value entered
 * @param placeholder - Placeholder for input
 * @example
 * ```javascript
 * Unidit.Prompt("Enter your name", "Prompt Dialog", function (name) {
 *     if (name.length < 3) {
 *         Unidit.Alert("The name must be at least 3 letters");
 *         return false;
 *     }
 *     // do something
 * });
 * ```
 */
export const Prompt = (
	msg: string,
	title: string | (() => false | void) | undefined,
	callback: (value: string) => false | void,
	placeholder?: string,
	defaultValue?: string
): Dialog => {
	const dialog = new Dialog(),
		cancelButton = Button(dialog, 'cancel', 'Cancel'),
		okButton = Button(dialog, 'ok', 'Ok'),
		form = dialog.c.element('form', {
			class: 'unidit-dialog_prompt'
		}),
		inputElement = dialog.c.element('input', {
			autofocus: true,
			class: 'unidit-input'
		}),
		labelElement = dialog.c.element('label');

	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}

	if (placeholder) {
		attr(inputElement, 'placeholder', placeholder);
	}

	labelElement.appendChild(dialog.c.text(msg));

	form.appendChild(labelElement);
	form.appendChild(inputElement);

	cancelButton.onAction(dialog.close);

	const onclick = () => {
		if (
			!callback ||
			!isFunction(callback) ||
			callback(inputElement.value) !== false
		) {
			dialog.close();
		}
	};

	okButton.onAction(onclick);

	dialog.e.on(form, 'submit', () => {
		onclick();
		return false;
	});

	dialog.setFooter([okButton, cancelButton]);

	dialog.open(form, (title as string) || '&nbsp;', true, true);
	inputElement.focus();

	if (defaultValue !== undefined && defaultValue.length) {
		inputElement.value = defaultValue;
		inputElement.select();
	}

	return dialog;
};
