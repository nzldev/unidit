/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugins/limit
 */

import type { IUnidit, SnapshotType } from 'unidit/types';
import { Config } from 'unidit/config';
import { Plugin } from 'unidit/core/plugin';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from 'unidit/core/constants';
import { stripTags } from 'unidit/core/helpers';
import { autobind } from 'unidit/core/decorators';

declare module 'unidit/config' {
	interface Config {
		/**
		 * limit words count
		 */
		limitWords: false | number;

		/**
		 * limit chars count
		 */
		limitChars: false | number;

		/**
		 * limit html chars count
		 */
		limitHTML: false;
	}
}

Config.prototype.limitWords = false;
Config.prototype.limitChars = false;
Config.prototype.limitHTML = false;

/**
 * Plugin control for chars or words count
 */
export class limit extends Plugin {
	/** @override **/
	protected afterInit(unidit: IUnidit): void {
		const { limitWords, limitChars } = unidit.o;

		if (unidit && (limitWords || limitChars)) {
			let snapshot: SnapshotType | null = null;

			unidit.e
				.off('.limit')
				.on('beforePaste.limit', () => {
					snapshot = unidit.observer.snapshot.make();
				})
				.on(
					'keydown.limit keyup.limit beforeEnter.limit beforePaste.limit',
					this.checkPreventKeyPressOrPaste
				)
				.on('change.limit', this.checkPreventChanging)
				.on('afterPaste.limit', (): false | void => {
					if (this.shouldPreventInsertHTML() && snapshot) {
						unidit.observer.snapshot.restore(snapshot);
						return false;
					}
				});
		}
	}

	/**
	 * Action should be prevented
	 */
	private shouldPreventInsertHTML(
		event: KeyboardEvent | null = null,
		inputText: string = ''
	): boolean {
		if (event && COMMAND_KEYS.includes(event.key)) {
			return false;
		}

		const { unidit } = this;
		const { limitWords, limitChars } = unidit.o;
		const text =
			inputText || (unidit.o.limitHTML ? unidit.value : unidit.text);

		const words = this.splitWords(text);

		if (limitWords && words.length >= limitWords) {
			return true;
		}

		return Boolean(limitChars) && words.join('').length >= limitChars;
	}

	/**
	 * Check if some keypress or paste should be prevented
	 */
	@autobind
	private checkPreventKeyPressOrPaste(event: KeyboardEvent): void | false {
		if (this.shouldPreventInsertHTML(event)) {
			return false;
		}
	}

	/**
	 * Check if some external changing should be prevented
	 */
	@autobind
	private checkPreventChanging(newValue: string, oldValue: string) {
		const { unidit } = this;
		const { limitWords, limitChars } = unidit.o;

		const text = unidit.o.limitHTML ? newValue : stripTags(newValue),
			words = this.splitWords(text);

		if (
			(limitWords && words.length > limitWords) ||
			(Boolean(limitChars) && words.join('').length > limitChars)
		) {
			unidit.value = oldValue;
		}
	}

	/**
	 * Split text on words without technical characters
	 */
	private splitWords(text: string): string[] {
		return text
			.replace(INVISIBLE_SPACE_REG_EXP(), '')
			.split(SPACE_REG_EXP())
			.filter(e => e.length);
	}

	/** @override **/
	protected beforeDestruct(unidit: IUnidit): void {
		unidit.e.off('.limit');
	}
}
