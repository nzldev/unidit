/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type {
	CanPromise,
	IControlType,
	IDictionary,
	IViewBased,
	Nullable,
	IUnidit,
	RejectablePromise
} from 'unidit/types';
import { isFunction } from '../checker/is-function';
import { isPromise } from '../checker/is-promise';
import { get } from './get';
import { dataBind } from './data-bind';
import { isVoid } from '../checker/is-void';
import { isPlainObject, isString } from '../checker';
import { css } from './css';
import { CamelCaseToKebabCase } from '../string';

/**
 * Call function with parameters
 *
 * @example
 * ```js
 * const f = Math.random();
 * Unidit.modules.Helpers.call(f > 0.5 ? Math.ceil : Math.floor, f);
 * ```
 */

export function call<T extends any[], R>(
	func: (...args: T) => R,
	...args: T
): R {
	return func(...args);
}

/**
 * Get attribute
 */
export function attr(elm: Element, key: string): null | string;

/**
 * Remove attribute
 */
export function attr(elm: Element, key: string, value: null): null | string;

/**
 * Set attribute
 */
export function attr(
	elm: Element,
	key: string,
	value: string | number | boolean | undefined | null
): null;

/**
 * Set or remove several attributes
 */
export function attr(
	elm: Element,
	attributes: IDictionary<string | number | boolean | null>
): null;

/**
 * Alias for `elm.getAttribute` but if set second argument `-{key}`
 * it will also check `data-{key}` attribute
 * if set `value` it is alias for setAttribute with same logic
 */
export function attr(
	elm: Element,
	keyOrAttributes: string | IDictionary<string | number | boolean | null>,
	value?: string | number | boolean | null
): null | string {
	if (!elm || !isFunction(elm.getAttribute)) {
		return null;
	}

	if (!isString(keyOrAttributes)) {
		Object.keys(keyOrAttributes).forEach(key => {
			const value = keyOrAttributes[key];

			if (isPlainObject(value) && key === 'style') {
				css(<HTMLElement>elm, value as IDictionary<string>);
			} else {
				if (key === 'className') {
					key = 'class';
				}

				attr(elm, key, value);
			}
		});

		return null;
	}

	let key = CamelCaseToKebabCase(keyOrAttributes);

	if (/^-/.test(key)) {
		const res = attr(elm, `data${key}`);

		if (res) {
			return res;
		}

		key = key.substr(1);
	}

	if (value !== undefined) {
		if (value == null) {
			elm.hasAttribute(key) && elm.removeAttribute(key);
		} else {
			elm.setAttribute(key, value.toString());
			return value.toString();
		}
	}

	return elm.getAttribute(key);
}

/**
 * Mark element for debugging
 */
export function markOwner(unidit: IViewBased, elm: HTMLElement): void {
	attr(elm, 'data-editor_id', unidit.id);

	!elm.component &&
		Object.defineProperty(elm, 'unidit', {
			value: unidit
		});
}

export function callPromise(
	condition: CanPromise<unknown>,
	callback: () => CanPromise<any>
): CanPromise<void> {
	if (isPromise(condition)) {
		return condition.finally(callback);
	}

	return callback();
}

const map: IDictionary = {};

/**
 * Reset Vanila JS native function
 * @example
 * ```js
 * reset('Array.from')(Set([1,2,3])) // [1, 2, 3]
 * ```
 */
export const reset = function <T extends Function>(key: string): Nullable<T> {
	if (!(key in map)) {
		const iframe = document.createElement('iframe');

		try {
			iframe.src = 'about:blank';
			document.body.appendChild(iframe);

			if (!iframe.contentWindow) {
				return null;
			}

			const func = get(key, iframe.contentWindow),
				bind = get(
					key.split('.').slice(0, -1).join('.'),
					iframe.contentWindow
				);

			if (isFunction(func)) {
				map[key] = func.bind(bind);
			}
		} catch (e) {
			if (!isProd) {
				throw e;
			}
		} finally {
			iframe.parentNode?.removeChild(iframe);
		}
	}

	return map[key] ?? null;
};

/**
 * Allow load image in promise
 */
export const loadImage = (
	src: string,
	unidit: IViewBased
): RejectablePromise<HTMLImageElement> =>
	unidit.async.promise<HTMLImageElement>((res, rej) => {
		const image = new Image(),
			onError = () => {
				unidit.e.off(image);
				rej?.();
			},
			onSuccess = () => {
				unidit.e.off(image);
				res(image);
			};

		unidit.e
			.one(image, 'load', onSuccess)
			.one(image, 'error', onError)
			.one(image, 'abort', onError);

		image.src = src;

		if (image.complete) {
			onSuccess();
		}
	});

export const keys = (obj: object, own: boolean = true): string[] => {
	if (own) {
		return Object.keys(obj);
	}

	const props: string[] = [];

	for (const key in obj) {
		props.push(key);
	}

	return props;
};

/**
 * Memorize last user chose
 */
export const memorizeExec = <T extends IUnidit = IUnidit>(
	editor: T,
	_: unknown,
	{ control }: { control: IControlType<T> },
	preProcessValue?: (value: string) => string
): void | false => {
	const key = `button${control.command}`;

	let value = (control.args && control.args[0]) || dataBind(editor, key);

	if (isVoid(value)) {
		return false;
	}

	dataBind(editor, key, value);

	if (preProcessValue) {
		value = preProcessValue(value);
	}

	editor.execCommand(control.command as string, false, value || undefined);
};
