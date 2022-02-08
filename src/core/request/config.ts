/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module request
 */

import type { AjaxOptions } from 'unidit/types';
import { Config } from 'unidit/config';

declare module 'unidit/config' {
	interface Config {
		/**
		 * A set of key/value pairs that configure the Ajax request. All settings are optional
		 */
		defaultAjaxOptions: AjaxOptions;
	}
}

Config.prototype.defaultAjaxOptions = {
	successStatuses: [200, 201, 202],

	dataType: 'json',
	method: 'GET',
	url: '',
	data: null,
	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

	headers: {
		'X-REQUESTED-WITH': 'XMLHttpRequest' // compatible with jQuery
	},

	withCredentials: false,

	xhr(): XMLHttpRequest {
		return new XMLHttpRequest();
	}
} as AjaxOptions;
