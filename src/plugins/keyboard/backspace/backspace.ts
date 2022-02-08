/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/keyboard/backspace
 */

import type { IUnidit } from 'unidit/types';
import { Plugin } from 'unidit/core/plugin';
import { Dom } from 'unidit/core/dom';
import { INVISIBLE_SPACE } from 'unidit/core/constants';
import { isFunction, trim } from 'unidit/core/helpers';
import { normalizeCursorPosition } from 'unidit/plugins/keyboard/helpers';
import { cases } from './cases';
import type { DeleteMode } from './interface';
import { checkNotCollapsed } from './cases/check-not-collapsed';

import './config';

export class Backspace extends Plugin {
	/** @override */
	override requires = ['hotkeys'];

	/** @override */
	protected afterInit(unidit: IUnidit): void {
		unidit.e.on('afterCommand.delete', (command: 'delete' | string) => {
			if (command === 'delete') {
				this.afterDeleteCommand();
			}
		});

		unidit
			.registerCommand(
				'deleteButton',
				{
					exec: () => this.onDelete(false),
					hotkeys: unidit.o.delete.hotkeys.delete
				},
				{
					stopPropagation: false
				}
			)
			.registerCommand(
				'backspaceButton',
				{
					exec: () => this.onDelete(true),
					hotkeys: unidit.o.delete.hotkeys.backspace
				},
				{
					stopPropagation: false
				}
			)
			.registerCommand('deleteWordButton', {
				exec: () => this.onDelete(false, 'word'),
				hotkeys: unidit.o.delete.hotkeys.deleteWord
			})
			.registerCommand('backspaceWordButton', {
				exec: () => this.onDelete(true, 'word'),
				hotkeys: unidit.o.delete.hotkeys.backspaceWord
			})
			.registerCommand('deleteSentenceButton', {
				exec: () => this.onDelete(false, 'sentence'),
				hotkeys: unidit.o.delete.hotkeys.deleteSentence
			})
			.registerCommand('backspaceSentenceButton', {
				exec: () => this.onDelete(true, 'sentence'),
				hotkeys: unidit.o.delete.hotkeys.backspaceSentence
			});
	}

	/** @override */
	protected beforeDestruct(unidit: IUnidit): void {
		unidit.e.off('afterCommand.delete');
	}

	/**
	 * After Delete command remove extra BR
	 */
	private afterDeleteCommand(): void {
		const unidit = this.j;

		const current = unidit.s.current();

		if (current && Dom.isTag(current.firstChild, 'br')) {
			unidit.s.removeNode(current.firstChild);
		}

		if (
			!trim(unidit.editor.textContent || '') &&
			!unidit.editor.querySelector('img') &&
			(!current || !Dom.closest(current, 'table', unidit.editor))
		) {
			unidit.editor.innerHTML = '';

			const node = unidit.s.setCursorIn(unidit.editor);

			unidit.s.removeNode(node);
		}
	}

	/**
	 * Listener BackSpace or Delete button
	 */
	private onDelete(
		backspace: boolean,
		mode: DeleteMode = 'char'
	): false | void {
		const unidit = this.j;

		const sel = unidit.selection;

		if (!sel.isFocused()) {
			sel.focus();
		}

		if (checkNotCollapsed(unidit)) {
			return false;
		}

		const range = sel.range;
		const fakeNode = unidit.createInside.text(INVISIBLE_SPACE);

		try {
			range.insertNode(fakeNode);

			if (!Dom.isOrContains(unidit.editor, fakeNode)) {
				return;
			}

			normalizeCursorPosition(unidit, fakeNode, backspace);

			if (
				cases.some(
					(func): void | boolean =>
						isFunction(func) &&
						func(unidit, fakeNode, backspace, mode)
				)
			) {
				return false;
			}
		} catch (e) {
			if (!isProd) {
				console.error(e);
			}

			throw e;
		} finally {
			this.safeRemoveEmptyNode(fakeNode);
		}

		return false;
	}

	/**
	 * Remove node and replace cursor position out of it
	 */
	private safeRemoveEmptyNode(fakeNode: Node) {
		const { range } = this.j.s;

		if (range.startContainer === fakeNode) {
			if (fakeNode.previousSibling) {
				if (Dom.isText(fakeNode.previousSibling)) {
					range.setStart(
						fakeNode.previousSibling,
						fakeNode.previousSibling.nodeValue?.length ?? 0
					);
				} else {
					range.setStartAfter(fakeNode.previousSibling);
				}
			} else if (fakeNode.nextSibling) {
				if (Dom.isText(fakeNode.nextSibling)) {
					range.setStart(fakeNode.nextSibling, 0);
				} else {
					range.setStartBefore(fakeNode.nextSibling);
				}
			}

			range.collapse(true);
			this.j.s.selectRange(range);
		}

		Dom.safeRemove(fakeNode);
	}
}
