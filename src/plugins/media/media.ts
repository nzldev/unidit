/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/media
 */

import type { IUnidit } from 'unidit/types';
import { Config } from 'unidit/config';
import * as consts from 'unidit/core/constants';
import { $$, attr, dataBind } from 'unidit/core/helpers';

declare module 'unidit/config' {
	interface Config {
		/**
		 * Decorate media elements
		 */
		mediaInFakeBlock: boolean;

		/**
		 * Decorate media element with tag
		 */
		mediaFakeTag: string;

		/**
		 * Media tags
		 */
		mediaBlocks: string[];
	}
}

Config.prototype.mediaFakeTag = 'unidit-media';
Config.prototype.mediaInFakeBlock = true;
Config.prototype.mediaBlocks = ['video', 'audio'];

/**
 * Process `video` and `audio`
 */
export function media(editor: IUnidit): void {
	const keyFake: string = 'unidit_fake_wrapper';

	const { mediaFakeTag, mediaBlocks, mediaInFakeBlock } = editor.options;

	const wrap = (element: HTMLElement) => {
		if (
			element.parentNode &&
			attr(element.parentNode as HTMLElement, 'data-unidit_iframe_wrapper')
		) {
			element = element.parentNode as HTMLElement;
		} else {
			const wrapper = editor.createInside.fromHTML(
				`<${mediaFakeTag} data-unidit-temp="1" contenteditable="false" draggable="true" data-${keyFake}="1"></${mediaFakeTag}>`
			);

			attr(wrapper, 'style', attr(element, 'style'));

			wrapper.style.display =
				element.style.display === 'inline-block'
					? 'inline-block'
					: 'block';
			wrapper.style.width = element.offsetWidth + 'px';
			wrapper.style.height = element.offsetHeight + 'px';

			if (element.parentNode) {
				element.parentNode.insertBefore(wrapper, element);
			}

			wrapper.appendChild(element);

			element = wrapper;
		}

		editor.e
			.off(element, 'mousedown.select touchstart.select')
			.on(element, 'mousedown.select touchstart.select', () => {
				editor.s.setCursorAfter(element);
			});
	};

	if (mediaInFakeBlock) {
		editor.e
			.on('afterGetValueFromEditor', (data: { value: string }) => {
				const rxp = new RegExp(
					`<${mediaFakeTag}[^>]+data-${keyFake}[^>]+>([^]+?)</${mediaFakeTag}>`,
					'ig'
				);

				if (rxp.test(data.value)) {
					data.value = data.value.replace(rxp, '$1');
				}
			})
			.on(
				'change afterInit afterSetMode changePlace',
				editor.async.debounce(() => {
					if (
						!editor.isDestructed &&
						editor.getMode() !== consts.MODE_SOURCE
					) {
						$$(mediaBlocks.join(','), editor.editor).forEach(
							(elm: HTMLElement) => {
								if (!dataBind(elm, keyFake)) {
									dataBind(elm, keyFake, true);
									wrap(elm);
								}
							}
						);
					}
				}, editor.defaultTimeout)
			);
	}
}
