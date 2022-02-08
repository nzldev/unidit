/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/string
 */

import type { IDictionary, ILanguageOptions } from 'unidit/types';
import { Config } from 'unidit/config';
import {
	defaultLanguage as defineLanguage,
	error
} from 'unidit/core/helpers/utils';
import { isString } from 'unidit/core/helpers/checker';
import { ucfirst } from 'unidit/core/helpers/string';
import { lang } from 'unidit/core/global';

/**
 * Simple variant sprintf function
 */
// declare const isProd: boolean;
export const sprintf = (str: string, args?: Array<string | number>): string => {
	if (!args || !args.length) {
		return str;
	}

	const reg = /%([sd])/g;

	let fnd = reg.exec(str);
	let res = str,
		i = 0;

	while (fnd && args[i] !== undefined) {
		res = res.replace(fnd[0], args[i].toString());
		i += 1;
		fnd = reg.exec(str);
	}

	return res;
};

/**
 * Internationalization method. Uses Unidit.lang object
 * @example
 * ```javascript
 * var editor = new Unidit("#redactor", {
 *      language: 'ru'
 * });
 * console.log(editor.i18n('Cancel')) //Отмена;
 *
 * Unidit.defaultOptions.language = 'ru';
 * console.log(Unidit.prototype.i18n('Cancel')) //Отмена
 *
 * Unidit.lang.cs = {
 *    Cancel: 'Zrušit'
 * };
 * Unidit.defaultOptions.language = 'cs';
 * console.log(Unidit.prototype.i18n('Cancel')) //Zrušit
 *
 * Unidit.lang.cs = {
 *    'Hello world': 'Hello \s Good \s'
 * };
 * Unidit.defaultOptions.language = 'cs';
 * console.log(Unidit.prototype.i18n('Hello world', 'mr.Perkins', 'day')) //Hello mr.Perkins Good day
 * ```
 */
export const i18n = (
	key: string,
	params?: Array<string | number>,
	options?: ILanguageOptions
): string => {
	if (!isString(key)) {
		throw error('i18n: Need string in first argument');
	}

	if (!key.length) {
		return key;
	}

	const debug: boolean = Boolean(
		options !== undefined && options.debugLanguage
	);

	let store: IDictionary;

	const parse = (value: string): string =>
			params && params.length ? sprintf(value, params) : value,
		defaultLanguage = defineLanguage(
			Config.defaultOptions.language,
			Config.defaultOptions.language
		),
		language = defineLanguage(options?.language, defaultLanguage),
		tryGet = (store: IDictionary): string | undefined => {
			if (!store) {
				return;
			}

			if (isString(store[key])) {
				return parse(store[key]);
			}

			const lcKey = key.toLowerCase();

			if (isString(store[lcKey])) {
				return parse(store[lcKey]);
			}

			const ucfKey = ucfirst(key);

			if (isString(store[ucfKey])) {
				return parse(store[ucfKey]);
			}

			return;
		};

	if (lang[language] !== undefined) {
		store = lang[language];
	} else {
		if (lang[defaultLanguage] !== undefined) {
			store = lang[defaultLanguage];
		} else {
			store = lang.en;
		}
	}

	const i18nOvr = options?.i18n;

	if (i18nOvr && i18nOvr[language]) {
		const result = tryGet(i18nOvr[language]);

		if (result) {
			return result;
		}
	}

	const result = tryGet(store);

	if (result) {
		return result;
	}

	if (lang.en && isString(lang.en[key]) && lang.en[key]) {
		return parse(lang.en[key]);
	}

	if (debug) {
		return '{' + key + '}';
	}

	if (!isProd && language !== 'en') {
		console.warn(`i18n need "${key}" in "${language}"`);
	}

	return parse(key);
};
