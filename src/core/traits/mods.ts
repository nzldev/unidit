/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module traits
 */

import type { IComponent, IContainer, IMods, ModType } from 'unidit/types';
import { toArray } from 'unidit/core/helpers/array/to-array';
import { isVoid } from 'unidit/core/helpers/checker/is-void';

export abstract class Mods implements IMods {
	abstract mods: IMods['mods'];
	abstract componentName: string;
	abstract container: HTMLElement;

	abstract setMod(name: string, value: ModType): this;
	abstract getMod(name: string): ModType;

	/**
	 * Set/remove BEM class modification
	 *
	 * @param value - if null, mod will be removed
	 */
	static setMod<T extends IComponent & IContainer & Mods>(
		this: T,
		name: string,
		value: ModType,
		container?: HTMLElement
	): void {
		name = name.toLowerCase();

		if (this.mods[name] === value) {
			return;
		}

		const mod = `${this.componentName}_${name}`,
			cl = (container || this.container).classList;

		toArray(cl).forEach(className => {
			if (className.indexOf(mod) === 0) {
				cl.remove(className);
			}
		});

		!isVoid(value) &&
			value !== '' &&
			cl.add(`${mod}_${value.toString().toLowerCase()}`);

		this.mods[name] = value;
	}

	/**
	 * Get BEM class modification value
	 */
	static getMod(this: IComponent & IContainer & Mods, name: string): ModType {
		return this.mods[name] ?? null;
	}
}
