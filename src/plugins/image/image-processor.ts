/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/image
 */

import type { IUnidit } from 'unidit/types';
import { $$ } from 'unidit/core/helpers';

const JODIT_IMAGE_PROCESSOR_BINDED = '__unidit_imageprocessor_binded';

/**
 * Change editor's size after load all images
 */
export function imageProcessor(editor: IUnidit): void {
	editor.e.on(
		'change afterInit changePlace',
		editor.async.debounce(() => {
			if (editor.editor) {
				$$('img', editor.editor).forEach((elm: HTMLElement) => {
					if (!(elm as any)[JODIT_IMAGE_PROCESSOR_BINDED]) {
						(elm as any)[JODIT_IMAGE_PROCESSOR_BINDED] = true;
						if (!(elm as HTMLImageElement).complete) {
							elm.addEventListener(
								'load',
								function ElementOnLoad() {
									!editor.isInDestruct &&
										editor.e?.fire('resize');
									elm.removeEventListener(
										'load',
										ElementOnLoad
									);
								}
							);
						}

						editor.e.on(elm, 'mousedown touchstart', () => {
							editor.s.select(elm);
						});
					}
				});
			}
		}, editor.defaultTimeout)
	);
}
