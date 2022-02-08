/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module types
 */

import type { IUnidit } from './unidit';
import type { CanPromise, IDestructible, IInitable } from './types';
import type { IViewBased } from './view';
import type { ButtonGroup, IControlType } from './toolbar';

export interface IPluginButton {
	name: string;
	group?: ButtonGroup;
	position?: number;
	options?: IControlType;
}

export class IPlugin<T extends IViewBased = IViewBased>
	implements IDestructible, IInitable
{
	unidit: T;

	static requires?: string[];
	requires?: string[];

	hasStyle?: boolean;

	/**
	 * Plugin buttons
	 */
	buttons?: IPluginButton[];

	init(unidit: T): void;
	destruct(unidit?: T): void;

	constructor(unidit?: T);
}

interface PluginFunction {
	// eslint-disable-next-line @typescript-eslint/no-misused-new
	constructor(unidit: IViewBased): void;
}

export type PluginType = typeof IPlugin | IPlugin | PluginFunction;
export type PluginInstance = IPlugin | object;

export interface IExtraPlugin {
	name: string;
	url?: string;
}

export interface IPluginSystem {
	add(name: string, plugin: any): void;
	get(name: string): PluginType | void;
	remove(name: string): void;
	init(unidit: IUnidit): CanPromise<void>;
}
