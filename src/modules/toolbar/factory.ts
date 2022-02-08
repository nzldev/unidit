/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:modules/toolbar/README.md]]
 * @packageDocumentation
 * @module modules/toolbar
 */

import type {
	IControlTypeContent,
	IControlTypeStrong,
	IToolbarButton,
	IToolbarCollection,
	IUIElement,
	IViewBased,
	Nullable
} from 'unidit/types';
import { isFunction, isUniditObject } from 'unidit/core/helpers';
import { ToolbarCollection } from './collection/collection';
import { ToolbarEditorCollection } from './collection/editor-collection';
import { ToolbarButton } from './button/button';
import { ToolbarContent } from './button/content';

/**
 * Collection factory
 */
export function makeCollection(
	unidit: IViewBased,
	parentElement?: IUIElement
): IToolbarCollection {
	const collection = isUniditObject(unidit)
		? new ToolbarEditorCollection(unidit)
		: new ToolbarCollection(unidit);

	if (unidit.o.textIcons) {
		collection.container.classList.add('unidit_text_icons');
	}

	if (parentElement) {
		collection.parentElement = parentElement;
	}

	if (unidit.o.toolbarButtonSize) {
		collection.buttonSize = unidit.o.toolbarButtonSize;
	}

	return collection;
}

/**
 * Button factory
 */
export function makeButton(
	unidit: IViewBased,
	control: IControlTypeStrong,
	target: Nullable<HTMLElement> = null
): IToolbarButton {
	if (isFunction(control.getContent)) {
		return new ToolbarContent(
			unidit,
			control as IControlTypeContent,
			target
		);
	}

	const button = new ToolbarButton(unidit, control, target);

	button.state.tabIndex = unidit.o.allowTabNavigation ? 0 : -1;

	return button;
}
