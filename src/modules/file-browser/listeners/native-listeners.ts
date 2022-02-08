/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/file-browser
 */

import type {
	HTMLTagNames,
	IFileBrowserItem,
	Nullable,
	IDictionary,
	IFileBrowser
} from 'unidit/types';
import { ctrlKey, attr } from 'unidit/core/helpers';
import contextMenu from '../builders/context-menu';
import { Dom } from 'unidit/core/dom';
import { elementsMap } from 'unidit/modules/file-browser/builders/elements-map';
import { loadTree } from 'unidit/modules/file-browser/fetch/load-tree';

export const getItem = (
	node: Nullable<EventTarget>,
	root: HTMLElement,
	tag: HTMLTagNames = 'a'
): Nullable<HTMLElement> =>
	Dom.closest(node as Node, elm => Dom.isTag(elm, tag), root);

export const elementToItem = (
	elm: HTMLElement,
	elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}>
): IFileBrowserItem | void => {
	const { key } = elm.dataset,
		{ item } = elementsMap[key || ''];

	return item;
};

export function nativeListeners(this: IFileBrowser): void {
	let dragElement: false | HTMLElement = false;
	const elmMap = elementsMap(this);

	const self = this;

	self.e
		.on(self.tree.container, 'dragstart', (e: MouseEvent): void => {
			const a = getItem(e.target, self.container);

			if (!a) {
				return;
			}

			if (self.o.moveFolder) {
				dragElement = a;
			}
		})
		.on(self.tree.container, 'drop', (e: MouseEvent): boolean | void => {
			if ((self.o.moveFile || self.o.moveFolder) && dragElement) {
				let path = attr(dragElement, '-path') || '';

				// move folder
				if (
					!self.o.moveFolder &&
					dragElement.classList.contains(
						this.tree.getFullElName('item')
					)
				) {
					return false;
				}

				// move file
				if (
					dragElement.classList.contains(
						this.files.getFullElName('item')
					)
				) {
					path += attr(dragElement, '-name');

					if (!self.o.moveFile) {
						return false;
					}
				}

				const a = getItem(e.target, self.container);

				if (!a) {
					return;
				}

				self.dataProvider
					.move(
						path,
						attr(a, '-path') || '',
						attr(a, '-source') || '',
						dragElement.classList.contains(
							this.files.getFullElName('item')
						)
					)
					.then(() => loadTree(this))
					.catch(self.status);

				dragElement = false;
			}
		})
		.on(self.files.container, 'contextmenu', contextMenu(self))
		.on(self.files.container, 'click', (e: MouseEvent): void => {
			if (!ctrlKey(e)) {
				this.state.activeElements = [];
			}
		})
		.on(self.files.container, 'click', (e: MouseEvent): false | void => {
			const a = getItem(e.target, self.container);

			if (!a) {
				return;
			}

			const item = elementToItem(a, elmMap);

			if (!item) {
				return;
			}

			if (!ctrlKey(e)) {
				self.state.activeElements = [item];
			} else {
				self.state.activeElements = [
					...self.state.activeElements,
					item
				];
			}

			e.stopPropagation();

			return false;
		})
		.on(self.files.container, 'dragstart', (e: MouseEvent) => {
			if (self.o.moveFile) {
				const a = getItem(e.target, self.container);

				if (!a) {
					return;
				}

				dragElement = a;
			}
		})
		.on(self.container, 'drop', (e: DragEvent) => e.preventDefault());
}
