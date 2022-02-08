/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module helpers/utils
 */

import type { IViewBased } from 'unidit/types';
import { completeUrl } from './complete-url';
import { isFunction, isString } from '../checker';

export type Loader = (unidit: IViewBased, url: string) => Promise<any>;

export interface CallbackAndElement {
	callback: EventListener;
	element: HTMLElement;
}

const alreadyLoadedList = new Map<string, Promise<any>>();

const cacheLoaders = (loader: Loader): Loader => {
	return async (unidit: IViewBased, url: string): Promise<any> => {
		if (alreadyLoadedList.has(url)) {
			return alreadyLoadedList.get(url) as Promise<any>;
		}

		const promise = loader(unidit, url);

		alreadyLoadedList.set(url, promise);

		return promise;
	};
};

/**
 * Append script in document and call callback function after download
 */
export const appendScript = (
	unidit: IViewBased,
	url: string,
	callback: (this: HTMLElement, e?: Event) => any
): CallbackAndElement => {
	const script = unidit.c.element('script');

	script.type = 'text/javascript';
	script.async = true;

	if (isFunction(callback) && !unidit.isInDestruct) {
		unidit.e.on(script, 'load', callback);
	}

	if (!script.src) {
		script.src = completeUrl(url);
	}

	unidit.od.body.appendChild(script);

	return {
		callback,
		element: script
	};
};

/**
 * Load script and return promise
 */
export const appendScriptAsync = cacheLoaders(
	(unidit: IViewBased, url: string) => {
		return new Promise((resolve, reject) => {
			const { element } = appendScript(unidit, url, resolve);
			!unidit.isInDestruct && unidit.e.on(element, 'error', reject);
		});
	}
);

/**
 * Download CSS style script
 */
export const appendStyleAsync = cacheLoaders(
	(unidit: IViewBased, url: string): Promise<HTMLElement> => {
		return new Promise((resolve, reject) => {
			const link = unidit.c.element('link');

			link.rel = 'stylesheet';
			link.media = 'all';
			link.crossOrigin = 'anonymous';

			const callback = () => resolve(link);

			!unidit.isInDestruct &&
				unidit.e.on(link, 'load', callback).on(link, 'error', reject);

			link.href = completeUrl(url);

			if (unidit.o.shadowRoot) {
				unidit.o.shadowRoot.appendChild(link);
			} else {
				unidit.od.body.appendChild(link);
			}
		});
	}
);

export const loadNext = (
	unidit: IViewBased,
	urls: string[],
	i: number = 0
): Promise<void> => {
	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	return appendScriptAsync(unidit, urls[i]).then(() =>
		loadNext(unidit, urls, i + 1)
	);
};

export const loadNextStyle = (
	unidit: IViewBased,
	urls: string[],
	i: number = 0
): Promise<void> => {
	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	return appendStyleAsync(unidit, urls[i]).then(() =>
		loadNextStyle(unidit, urls, i + 1)
	);
};
