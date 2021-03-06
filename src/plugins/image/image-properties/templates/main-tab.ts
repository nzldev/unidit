/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/image/image-properties
 */

import type { IUnidit } from 'unidit/types';
import { Icon } from '../../../../core/ui';

export function mainTab(editor: IUnidit): HTMLElement {
	const opt = editor.o,
		i18n = editor.i18n.bind(editor),
		gi = Icon.get.bind(Icon),
		hasFbUrl = opt.filebrowser.ajax.url || opt.uploader.url,
		hasEditor = opt.image.useImageEditor;

	return editor.c.fromHTML(`<div style="${
		!opt.image.editSrc ? 'display:none' : ''
	}" class="unidit-form__group">
			<label>${i18n('Src')}</label>
			<div class="unidit-input_group">
				<input data-ref="imageSrc" class="unidit-input" type="text"/>
				<div
					class="unidit-input_group-buttons"
					style="${hasFbUrl ? '' : 'display: none'}"
				>
						<a
							data-ref="changeImage"
							class="unidit-button"
						>${gi('image')}</a>
						<a
							data-ref="editImage"
							class="unidit-button"
							style="${hasEditor ? '' : 'display: none'}"
						>${gi('crop')}</a>
				</div>
			</div>
		</div>
		<div style="${
			!opt.image.editTitle ? 'display:none' : ''
		}" class="unidit-form__group">
			<label>${i18n('Title')}</label>
			<input data-ref="imageTitle" type="text" class="unidit-input"/>
		</div>
		<div style="${
			!opt.image.editAlt ? 'display:none' : ''
		}" class="unidit-form__group">
			<label>${i18n('Alternative')}</label>
			<input data-ref="imageAlt" type="text" class="unidit-input"/>
		</div>
		<div style="${
			!opt.image.editLink ? 'display:none' : ''
		}" class="unidit-form__group">
			<label>${i18n('Link')}</label>
			<input data-ref="imageLink" type="text" class="unidit-input"/>
		</div>
		<div style="${
			!opt.image.editLink ? 'display:none' : ''
		}" class="unidit-form__group">
			<label class="unidit_vertical_middle">
				<input data-ref="imageLinkOpenInNewTab" type="checkbox" class="unidit-checkbox"/>
				<span>${i18n('Open link in new tab')}</span>
			</label>
		</div>`);
}
