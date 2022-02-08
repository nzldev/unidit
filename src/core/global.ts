/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module global
 */

import type {
	HTMLTagNames,
	IComponent,
	IDictionary,
	IUnidit,
	IViewBased,
	IViewComponent
} from 'unidit/types';

import { PluginSystem } from './plugin/plugin-system';

import { Dom } from './dom';

import { EventEmitter } from './event-emitter';
import { isUniditObject, isViewObject } from './helpers/checker';
import { getClassName } from './helpers/utils/get-class-name';
import { kebabCase } from './helpers/string';

export const instances: IDictionary<IUnidit> = {};

let counter = 1;

const uuids = new Set();
/**
 * Generate global unique uid
 */
export function uniqueUid(): string {
	function gen(): string {
		counter += 10 * (Math.random() + 1);
		return Math.round(counter).toString(16);
	}

	let uid = gen();
	while (uuids.has(uid)) {
		uid = gen();
	}
	uuids.add(uid);

	return uid;
}

export const pluginSystem = new PluginSystem();

export const modules: IDictionary<Function> = {};

export const lang: IDictionary<IDictionary<string>> = {};

export const extendLang = (langs: IDictionary): void => {
	Object.keys(langs).forEach(key => {
		if (lang[key]) {
			Object.assign(lang[key], langs[key]);
		} else {
			lang[key] = langs[key];
		}
	});
};

const boxes = new WeakMap<IComponent, IDictionary<HTMLElement>>();

/**
 * Create unique box(HTMLCotainer) and remove it after destroy
 */
export function getContainer<T extends HTMLTagNames = HTMLTagNames>(
	unidit: IViewBased | IViewComponent,
	classFunc?: Function,
	tag: T = 'div' as T,
	createInsideEditor: boolean = false
): HTMLElementTagNameMap[T] {
	const name = classFunc ? getClassName(classFunc.prototype) : 'unidit-utils';

	const data = boxes.get(unidit) || {},
		key = name + tag;

	const view = isViewObject(unidit) ? unidit : unidit.j;

	if (!data[key]) {
		let c = view.c,
			body =
				isUniditObject(unidit) && unidit.o.shadowRoot
					? unidit.o.shadowRoot
					: unidit.od.body;

		if (
			createInsideEditor &&
			isUniditObject(unidit) &&
			unidit.od !== unidit.ed
		) {
			c = unidit.createInside;
			const place = tag === 'style' ? unidit.ed.head : unidit.ed.body;

			body =
				isUniditObject(unidit) && unidit.o.shadowRoot
					? unidit.o.shadowRoot
					: place;
		}

		const box = c.element(tag, {
			className: `unidit unidit-${kebabCase(name)}-container unidit-box`
		});

		box.classList.add(`unidit_theme_${view.o.theme || 'default'}`);

		body.appendChild(box);

		data[key] = box;

		unidit.hookStatus('beforeDestruct', () => {
			Dom.safeRemove(box);
			delete data[key];

			if (Object.keys(data).length) {
				boxes.delete(unidit);
			}
		});

		boxes.set(unidit, data);
	}

	data[key].classList.remove('unidit_theme_default', 'unidit_theme_dark');
	data[key].classList.add(`unidit_theme_${view.o.theme || 'default'}`);

	return data[key] as HTMLElementTagNameMap[T];
}

/**
 * Global event emitter
 */
export const eventEmitter = new EventEmitter();
