/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/link
 */

import type {
	IDictionary,
	IUnidit,
	IControlType,
	IUIForm,
	IUIOption,
	Nullable
} from 'unidit/types';
import { Config } from 'unidit/config';
import { Dom } from 'unidit/core/dom';
import {
	attr,
	convertMediaUrlToVideoEmbed,
	isString,
	isURL,
	refs,
	stripTags
} from 'unidit/core/helpers';
import { formTemplate } from './template';
import { Plugin } from 'unidit/core/plugin';
import { autobind } from 'unidit/core/decorators';
import { Dialog, UIForm } from '../../modules';

declare module 'unidit/config' {
	interface Config {
		link: {
			/**
			 * Template for the link dialog form
			 */
			formTemplate: (editor: IUnidit) => string | HTMLElement | IUIForm;
			formClassName?: string;

			/**
			 * Follow link address after dblclick
			 */
			followOnDblClick: boolean;

			/**
			 * Replace inserted youtube/vimeo link to `iframe`
			 */
			processVideoLink: boolean;

			/**
			 * Wrap inserted link
			 */
			processPastedLink: boolean;

			/**
			 * Show `no follow` checkbox in link dialog.
			 */
			noFollowCheckbox: boolean;

			/**
			 * Show `Open in new tab` checkbox in link dialog.
			 */
			openInNewTabCheckbox: boolean;

			/**
			 * Use an input text to ask the classname or a select or not ask
			 */
			modeClassName: 'input' | 'select';

			/**
			 * Allow multiple choises (to use with modeClassName="select")
			 */
			selectMultipleClassName: boolean;

			/**
			 * The size of the select (to use with modeClassName="select")
			 */
			selectSizeClassName?: number;

			/**
			 * The list of the option for the select (to use with modeClassName="select")
			 */
			selectOptionsClassName: IUIOption[];

			hotkeys: string[];
		};
	}
}

Config.prototype.link = {
	formTemplate,
	followOnDblClick: false,
	processVideoLink: true,
	processPastedLink: true,
	noFollowCheckbox: true,
	openInNewTabCheckbox: true,
	modeClassName: 'input',
	selectMultipleClassName: true,
	selectSizeClassName: 3,
	selectOptionsClassName: [],
	hotkeys: ['ctrl+k', 'cmd+k']
};

Config.prototype.controls.unlink = {
	exec: (editor: IUnidit, current: Node) => {
		const anchor: HTMLAnchorElement | false = Dom.closest(
			current,
			'a',
			editor.editor
		) as HTMLAnchorElement;

		if (anchor) {
			Dom.unwrap(anchor);
		}

		editor.setEditorValue();
		editor.e.fire('hidePopup');
	},
	tooltip: 'Unlink'
} as IControlType;

Config.prototype.controls.link = {
	isActive: (editor: IUnidit): boolean => {
		const current = editor.s.current();
		return Boolean(current && Dom.closest(current, 'a', editor.editor));
	},

	popup: (editor: IUnidit, current, self: IControlType, close: () => void) => {
		return editor.e.fire('generateLinkForm.link', current, close);
	},
	tags: ['a'],
	tooltip: 'Insert link'
} as IControlType;

/**
 * Process link. Insert, dblclick or remove format
 */
export class link extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'link',
			group: 'insert'
		}
	];

	/** @override */
	protected override afterInit(unidit: IUnidit): void {
		if (unidit.o.link.followOnDblClick) {
			unidit.e.on('dblclick.link', this.onDblClickOnLink);
		}

		if (unidit.o.link.processPastedLink) {
			unidit.e.on('processPaste.link', this.onProcessPasteLink);
		}

		unidit.e.on('generateLinkForm.link', this.generateForm);
		unidit.registerCommand('openLinkDialog', {
			exec: () => {
				const dialog = new Dialog({
					resizable: false
				});

				const htmlForm = this.generateForm(unidit.s.current(), () => {
					dialog.close();
				}) as UIForm;

				htmlForm.container.classList.add('unidit-dialog_alert');
				dialog.setContent(htmlForm);
				dialog.open();

				unidit.async.requestIdleCallback(() => {
					const { url_input } = refs(htmlForm.container);
					url_input?.focus();
				});
			},
			hotkeys: unidit.o.link.hotkeys
		});
	}

	@autobind
	private onDblClickOnLink(e: MouseEvent) {
		if (!Dom.isTag(e.target, 'a')) {
			return;
		}

		const href = attr(e.target, 'href');

		if (href) {
			location.href = href;
			e.preventDefault();
		}
	}

	@autobind
	private onProcessPasteLink(
		ignore: ClipboardEvent,
		html: string
	): HTMLAnchorElement | void {
		const { unidit } = this;

		if (isURL(html)) {
			if (unidit.o.link.processVideoLink) {
				const embed = convertMediaUrlToVideoEmbed(html);

				if (embed !== html) {
					unidit.e.stopPropagation('processPaste');

					return unidit.createInside.fromHTML(
						embed
					) as HTMLAnchorElement;
				}
			}

			const a = unidit.createInside.element('a');

			a.setAttribute('href', html);
			a.textContent = html;

			unidit.e.stopPropagation('processPaste');

			return a;
		}
	}

	@autobind
	private generateForm(
		current: Nullable<Node>,
		close: Function
	): HTMLElement | IUIForm {
		const { unidit } = this;

		const i18n = unidit.i18n.bind(unidit),
			{
				openInNewTabCheckbox,
				noFollowCheckbox,
				formTemplate,
				formClassName,
				modeClassName
			} = unidit.o.link;

		const html = formTemplate(unidit),
			form = isString(html)
				? (unidit.c.fromHTML(html, {
						target_checkbox_box: openInNewTabCheckbox,
						nofollow_checkbox_box: noFollowCheckbox
				  }) as HTMLFormElement)
				: html,
			htmlForm = Dom.isElement(form) ? form : form.container;

		const elements = refs(htmlForm),
			{ insert, unlink, content_input_box } = elements,
			{ target_checkbox, nofollow_checkbox, url_input } =
				elements as IDictionary<HTMLInputElement>,
			currentElement = current,
			isImageContent = Dom.isImage(currentElement);

		let { content_input } = elements as IDictionary<HTMLInputElement>;

		const { className_input } = elements as IDictionary<HTMLInputElement>,
			{ className_select } = elements as IDictionary<HTMLSelectElement>;

		if (!content_input) {
			content_input = unidit.c.element('input', {
				type: 'hidden',
				ref: 'content_input'
			});
		}

		if (formClassName) {
			htmlForm.classList.add(formClassName);
		}

		if (isImageContent) {
			Dom.hide(content_input_box);
		}

		let link: false | HTMLAnchorElement;

		const getSelectionText = () =>
			link
				? link.innerText
				: stripTags(unidit.s.range.cloneContents(), unidit.ed);

		if (current && Dom.closest(current, 'a', unidit.editor)) {
			link = Dom.closest(current, 'a', unidit.editor) as HTMLAnchorElement;
		} else {
			link = false;
		}

		if (!isImageContent && current) {
			content_input.value = getSelectionText();
		}

		if (link) {
			url_input.value = attr(link, 'href') || '';

			if (modeClassName) {
				switch (modeClassName) {
					case 'input':
						if (className_input) {
							className_input.value = attr(link, 'class') || '';
						}
						break;

					case 'select':
						if (className_select) {
							for (
								let i = 0;
								i < className_select.selectedOptions.length;
								i++
							) {
								const option = className_select.options.item(i);

								if (option) {
									option.selected = false;
								}
							}

							const classNames = attr(link, 'class') || '';

							classNames.split(' ').forEach(className => {
								if (className) {
									for (
										let i = 0;
										i < className_select.options.length;
										i++
									) {
										const option =
											className_select.options.item(i);

										if (
											option?.value &&
											option.value === className
										) {
											option.selected = true;
										}
									}
								}
							});
						}
						break;
				}
			}

			if (openInNewTabCheckbox && target_checkbox) {
				target_checkbox.checked = attr(link, 'target') === '_blank';
			}

			if (noFollowCheckbox && nofollow_checkbox) {
				nofollow_checkbox.checked = attr(link, 'rel') === 'nofollow';
			}

			insert.textContent = i18n('Update');
		} else {
			Dom.hide(unlink);
		}

		unidit.editor.normalize();
		const snapshot = unidit.observer.snapshot.make();

		if (unlink) {
			unidit.e.on(unlink, 'click', (e: MouseEvent) => {
				unidit.s.restore();
				unidit.observer.snapshot.restore(snapshot);

				if (link) {
					Dom.unwrap(link);
				}

				unidit.setEditorValue();

				close();
				e.preventDefault();
			});
		}

		const onSubmit = (): false => {
			if (!url_input.value.trim().length) {
				url_input.focus();
				url_input.classList.add('unidit_error');
				return false;
			}

			let links: HTMLAnchorElement[];

			unidit.s.restore();
			unidit.s.removeMarkers();
			unidit.editor.normalize();
			unidit.observer.snapshot.restore(snapshot);

			const textWasChanged =
				getSelectionText() !== content_input.value.trim();

			const ci = unidit.createInside;

			if (!link) {
				if (!unidit.s.isCollapsed()) {
					const node = unidit.s.current();

					if (Dom.isTag(node, ['img'])) {
						links = [Dom.wrap(node, 'a', ci) as HTMLAnchorElement];
					} else {
						links = unidit.s.wrapInTag('a') as HTMLAnchorElement[];
					}
				} else {
					const a = ci.element('a');
					unidit.s.insertNode(a, false, false);
					links = [a];
				}

				links.forEach(link => unidit.s.select(link));
			} else {
				links = [link];
			}

			links.forEach(a => {
				attr(a, 'href', url_input.value);

				if (modeClassName && (className_input ?? className_select)) {
					if (modeClassName === 'input') {
						if (
							className_input.value === '' &&
							a.hasAttribute('class')
						) {
							attr(a, 'class', null);
						}

						if (className_input.value !== '') {
							attr(a, 'class', className_input.value);
						}
					} else if (modeClassName === 'select') {
						if (a.hasAttribute('class')) {
							attr(a, 'class', null);
						}

						for (
							let i = 0;
							i < className_select.selectedOptions.length;
							i++
						) {
							const className =
								className_select.selectedOptions.item(i)?.value;

							if (className) {
								a.classList.add(className);
							}
						}
					}
				}

				if (!isImageContent) {
					let newContent = a.textContent;

					if (content_input.value.trim().length) {
						if (textWasChanged) {
							newContent = content_input.value;
						}
					} else {
						newContent = url_input.value;
					}

					const content = a.textContent;

					if (newContent !== content) {
						a.textContent = newContent;
					}
				}

				if (openInNewTabCheckbox && target_checkbox) {
					attr(
						a,
						'target',
						target_checkbox.checked ? '_blank' : null
					);
				}

				if (noFollowCheckbox && nofollow_checkbox) {
					attr(
						a,
						'rel',
						nofollow_checkbox.checked ? 'nofollow' : null
					);
				}
			});

			unidit.setEditorValue();

			close();

			return false;
		};

		if (Dom.isElement(form)) {
			unidit.e.on(form, 'submit', (event: Event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				onSubmit();
				return false;
			});
		} else {
			form.onSubmit(onSubmit);
		}

		return form;
	}

	/** @override */
	protected override beforeDestruct(unidit: IUnidit): void {
		unidit.e
			.off('generateLinkForm.link', this.generateForm)
			.off('dblclick.link', this.onDblClickOnLink)
			.off('processPaste.link', this.onProcessPasteLink);
	}
}
