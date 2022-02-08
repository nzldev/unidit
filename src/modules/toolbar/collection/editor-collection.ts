/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module modules/toolbar/collection
 */

import { ToolbarCollection } from './collection';
import * as consts from 'unidit/core/constants';
import { Dom } from 'unidit/core/dom';
import type {
	IDictionary,
	IToolbarButton,
	IViewBased,
	IUnidit,
	IBound
} from 'unidit/types';
import { css, isFunction, isUniditObject } from 'unidit/core/helpers';
import { component } from 'unidit/core/decorators';

@component
export class ToolbarEditorCollection extends ToolbarCollection<IUnidit> {
	/** @override */
	override className(): string {
		return 'ToolbarEditorCollection';
	}

	/** @override */
	override shouldBeDisabled(button: IToolbarButton): boolean {
		const disabled = super.shouldBeDisabled(button);

		if (disabled !== undefined) {
			return disabled;
		}

		const mode: number =
			button.control.mode === undefined
				? consts.MODE_WYSIWYG
				: button.control.mode;

		return !(mode === consts.MODE_SPLIT || mode === this.j.getRealMode());
	}

	/** @override */
	override shouldBeActive(button: IToolbarButton): boolean {
		if (isUniditObject(this.j) && !this.j.editorIsActive) {
			return false;
		}

		const active = super.shouldBeActive(button);

		if (active !== undefined) {
			return active;
		}

		const element = this.j.selection ? this.j.s.current() : null;

		if (!element) {
			return false;
		}

		let elm: Node | false;

		if (button.control.tags) {
			const tags: string[] = button.control.tags;

			elm = element;

			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (
							node &&
							tags.indexOf(node.nodeName.toLowerCase()) !== -1
						) {
							return true;
						}
					},
					this.j.editor
				)
			) {
				return true;
			}
		}

		// activate by supposed css
		if (button.control.css) {
			const css = button.control.css;

			elm = element;
			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (node && !Dom.isText(node)) {
							return this.checkActiveStatus(
								css,
								node as HTMLElement
							);
						}
					},
					this.j.editor
				)
			) {
				return true;
			}
		}

		return false;
	}

	private checkActiveStatus = (
		cssObject:
			| IDictionary<string | string[]>
			| IDictionary<(editor: IViewBased, value: string) => boolean>,
		node: HTMLElement
	): boolean => {
		let matches: number = 0,
			total: number = 0;

		Object.keys(cssObject).forEach((cssProperty: string) => {
			const cssValue = cssObject[cssProperty];

			if (isFunction(cssValue)) {
				if (cssValue(this.j, css(node, cssProperty).toString())) {
					matches += 1;
				}
			} else {
				if (
					cssValue.indexOf(css(node, cssProperty).toString()) !== -1
				) {
					matches += 1;
				}
			}

			total += 1;
		});

		return total === matches;
	};

	/** @override */
	override getTarget(button: IToolbarButton): Node | null {
		return button.target || this.j.s.current() || null;
	}

	/** @override */
	constructor(unidit: IUnidit) {
		super(unidit);
		this.prependInvisibleInput(this.container);
	}

	/**
	 * Adds an invisible element to the container that can handle the
	 * situation when the editor is inside the <label>
	 *
	 * @see https://github.com/unidit/unidit-react/issues/138
	 */
	private prependInvisibleInput(container: HTMLElement): void {
		const input = this.j.create.element('input', {
			tabIndex: -1,
			disabled: true, // Becouse <label> can trigger click
			style: 'width: 0; height:0; position: absolute; visibility: hidden;'
		});

		Dom.appendChildFirst(container, input);
	}

	/**
	 * Show the inline toolbar inside WYSIWYG editor.
	 * @param bound - you can set the place for displaying the toolbar,
	 * or the place will be in the place of the cursor
	 */
	override showInline(bound?: IBound): void {
		this.unidit.e.fire('showInlineToolbar', bound);
	}

	override hide(): void {
		this.unidit.e.fire('hidePopup');
		super.hide();
		this.unidit.e.fire('toggleToolbar');
	}

	override show(): void {
		super.show();
		this.unidit.e.fire('toggleToolbar');
	}
}
