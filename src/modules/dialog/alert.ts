/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/dialog
 */

import { Dialog } from './dialog';
import { asArray, isFunction } from 'unidit/core/helpers/';
import { Dom } from 'unidit/core/dom';
import { Button } from 'unidit/core/ui';

/**
 * Show `alert` dialog. Work without Unidit object
 * @example
 * ```javascript
 * Unidit.Alert("File was uploaded");
 * Unidit.Alert("File was uploaded", "Message");
 * Unidit.Alert("File was uploaded", function() {
 *    $('form').hide();
 * });
 * Unidit.Alert("File wasn't uploaded", "Error", function() {
 *    $('form').hide();
 * });
 * ```
 */
export const Alert = (
	msg: string | HTMLElement,
	title?: string | (() => void | false),
	callback?: string | ((dialog: Dialog) => void | false),
	className: string = 'unidit-dialog_alert'
): Dialog => {
	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}
	const dialog = new Dialog(),
		container = dialog.c.div(className),
		okButton = Button(dialog, 'ok', 'Ok');

	asArray(msg).forEach(oneMessage => {
		container.appendChild(
			Dom.isNode(oneMessage) ? oneMessage : dialog.c.fromHTML(oneMessage)
		);
	});

	okButton.onAction(() => {
		if (!callback || !isFunction(callback) || callback(dialog) !== false) {
			dialog.close();
		}
	});

	dialog.setFooter([okButton]);

	dialog.open(container, (title as string) || '&nbsp;', true, true);
	okButton.focus();

	return dialog;
};
