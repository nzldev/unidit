/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module selection
 */

import type { IUnidit, Nullable, CanUndef, CommitMode } from 'unidit/types';
import type { CommitStyle } from './commit-style';
import { normalizeNode } from 'unidit/core/helpers';
import {
	getSuitParent,
	getSuitChild,
	isInsideInvisibleElement,
	toggleCommitStyles,
	unwrapChildren
} from './api';
import { CHANGE, INITIAL, REPLACE, UNWRAP, WRAP } from './commit-style';
import { Dom } from 'unidit/core/dom';
import {
	toggleOrderedList,
	wrapAndCommitStyle,
	isSuitElement,
	extractSelectedPart,
	toggleCSS,
	FiniteStateMachine
} from './api';

export function ApplyStyle(unidit: IUnidit, cs: CommitStyle): void {
	const { s: sel, editor } = unidit;

	const fsm = new FiniteStateMachine('start', {
		start: {
			start() {
				sel.save();
				normalizeNode(editor.firstChild); // FF fix for test "commandsTest - Exec command "bold"
				this.setState('generator');
			}
		},

		generator: {
			initGenerator() {
				return unidit.s.wrapInTagGen();
			},

			nextFont(gen: Generator<HTMLElement>): CanUndef<HTMLElement> {
				const font = gen.next();

				if (font.done) {
					this.setState('end');
					return;
				}

				if (
					isInsideInvisibleElement(font.value, editor) ||
					Dom.isEmptyContent(font.value)
				) {
					return;
				}

				this.setState('check');

				return font.value;
			}
		},

		check: {
			work(font: HTMLElement): Nullable<HTMLElement> {
				let elm =
					getSuitParent(cs, font, unidit.editor) ||
					getSuitChild(cs, font);

				if (elm) {
					this.setState('wholeElement');
					return elm;
				}

				elm = Dom.closest(
					font,
					node => isSuitElement(cs, node, true),
					unidit.editor
				);

				if (elm) {
					if (!cs.elementIsBlock) {
						extractSelectedPart(elm, font, unidit);
					}
				}

				if (cs.elementIsList && Dom.isTag(elm, ['ul', 'ol'])) {
					this.setState('orderList');
					return font;
				}

				if (elm) {
					this.setState('wholeElement');
					return elm;
				}

				if (unwrapChildren(cs, font)) {
					this.setState('endProcess');
					return null;
				}

				this.setState('wrap');
				return font;
			}
		},

		wholeElement: {
			toggleStyles(toggleElm: HTMLElement): void {
				let mode: CommitMode = INITIAL;

				if (toggleCommitStyles(cs, toggleElm)) {
					mode = UNWRAP;
				} else {
					mode = toggleCSS(cs, toggleElm, unidit, mode);
				}

				this.setState('generator', mode);
			}
		},

		orderList: {
			toggleStyles(font: HTMLElement): void {
				let mode: CommitMode = INITIAL;
				const li = Dom.closest(font, 'li', unidit.editor);

				if (!li) {
					this.setState('generator');
					return;
				}

				const ul = Dom.closest(font, ['ul', 'ol'], unidit.editor);

				if (!ul) {
					this.setState('generator');
					return;
				}

				mode = toggleOrderedList(cs, li, unidit, mode);

				if (mode === REPLACE || mode === UNWRAP || mode === CHANGE) {
					this.setState('endWhile');
					return;
				}

				this.setState('generator');
			}
		},

		wrap: {
			toggleStyles(font: HTMLElement): void {
				if (this.getSubState() !== 'unwrap') {
					const toggleElm = wrapAndCommitStyle(cs, font, unidit);
					toggleCSS(cs, toggleElm, unidit, WRAP);
				}

				this.setState('generator');
			}
		},

		endWhile: {
			nextFont(gen: Generator<HTMLElement>): void {
				const font = gen.next();

				if (font.done) {
					this.setState('end');
				}
			}
		},

		endProcess: {
			toggleStyles() {
				this.setState('generator');
			}
		},

		end: {
			finalize() {
				sel.restore();
			}
		}
	});

	fsm.dispatch('start');

	const gen = fsm.dispatch('initGenerator');

	while (fsm.getState() !== 'end') {
		const font = fsm.dispatch<HTMLElement>('nextFont', gen);

		if (font) {
			const wrapper = fsm.dispatch<HTMLElement>('work', font);
			fsm.dispatch('toggleStyles', wrapper);
		}
	}

	fsm.dispatch('finalize', gen);
}
