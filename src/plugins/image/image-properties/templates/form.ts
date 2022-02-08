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

export function form(editor: IUnidit): HTMLElement {
	const { showPreview, editSize } = editor.o.image,
		gi = Icon.get.bind(Icon);

	return editor.c.fromHTML(`<form class="unidit-properties">
		<div class="unidit-grid unidit-grid_xs-column">
			<div class="unidit_col-lg-2-5 unidit_col-xs-5-5">
				<div class="unidit-properties_view_box">
					<div style="${
						!showPreview ? 'display:none' : ''
					}" class="unidit-properties_image_view">
						<img data-ref="imageViewSrc" src="" alt=""/>
					</div>
					<div style="${
						!editSize ? 'display:none' : ''
					}" class="unidit-form__group unidit-properties_image_sizes">
						<input data-ref="imageWidth" type="text" class="unidit-input"/>
						<a data-ref="lockSize" class="unidit-properties__lock">${gi('lock')}</a>
						<input data-ref="imageHeight" type="text" class="imageHeight unidit-input"/>
					</div>
				</div>
			</div>
			<div data-ref="tabsBox" class="unidit_col-lg-3-5 unidit_col-xs-5-5"></div>
		</div>
	</form>`);
}
