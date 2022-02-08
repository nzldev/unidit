/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module types
 */

import type { IDictionary, Nullable } from 'unidit/types';

export type ModType = string | boolean | null;

export interface IMods {
	/**
	 * Set/remove modification (null - remove)
	 */
	setMod(name: string, value: ModType): this;
	getMod(name: string): ModType;
	mods: IDictionary<ModType>;
}

export interface IElms {
	getElm(elementName: string): Nullable<HTMLElement>;
	getElms(elementName: string): HTMLElement[];
}
