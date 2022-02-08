/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module plugin
 */

import type {
	IExtraPlugin,
	IDictionary,
	IUnidit,
	IPlugin,
	IPluginSystem,
	PluginInstance,
	PluginType,
	CanPromise,
	CanUndef,
	Nullable
} from 'unidit/types';

import {
	isInitable,
	isDestructable,
	isFunction,
	appendScriptAsync,
	splitArray,
	appendStyleAsync,
	isString,
	kebabCase,
	callPromise,
	isArray
} from 'unidit/core/helpers';

/**
 * Unidit plugin system
 * @example
 * ```js
 * Unidit.plugins.add('emoji2', {
 * 	init() {
 *  	alert('emoji Inited2')
 * 	},
 *	destruct() {}
 * });
 * ```
 */
export class PluginSystem implements IPluginSystem {
	private normalizeName(name: string): string {
		return kebabCase(name).toLowerCase();
	}

	private _items = new Map<string, PluginType>();

	private items(filter: Nullable<string[]>): Array<[string, PluginType]> {
		const results: Array<[string, PluginType]> = [];

		this._items.forEach((plugin, name) => {
			results.push([name, plugin]);
		});

		return results.filter(([name]) => !filter || filter.includes(name));
	}

	/**
	 * Add plugin in store
	 */
	add(name: string, plugin: PluginType): void {
		this._items.set(this.normalizeName(name), plugin);
	}

	/**
	 * Get plugin from store
	 */
	get(name: string): PluginType | void {
		return this._items.get(this.normalizeName(name));
	}

	/**
	 * Remove plugin from store
	 */
	remove(name: string): void {
		this._items.delete(this.normalizeName(name));
	}

	/**
	 * Public method for async init all plugins
	 */
	init(unidit: IUnidit): CanPromise<void> {
		const extrasList: IExtraPlugin[] = unidit.o.extraPlugins.map(s =>
				isString(s) ? { name: s } : s
			),
			disableList = splitArray(unidit.o.disablePlugins).map(s =>
				this.normalizeName(s)
			),
			doneList: string[] = [],
			promiseList: IDictionary<PluginInstance | undefined> = {},
			plugins: PluginInstance[] = [],
			pluginsMap: IDictionary<PluginInstance> = {},
			makeAndInit = ([name, plugin]: [string, PluginType]) => {
				if (
					disableList.includes(name) ||
					doneList.includes(name) ||
					promiseList[name]
				) {
					return;
				}

				const requires = (plugin as any)?.requires as CanUndef<
					string[]
				>;

				if (
					requires &&
					isArray(requires) &&
					this.hasDisabledRequires(disableList, requires)
				) {
					return;
				}

				const instance = PluginSystem.makePluginInstance(unidit, plugin);

				if (instance) {
					this.initOrWait(
						unidit,
						name,
						instance,
						doneList,
						promiseList
					);

					plugins.push(instance);
					pluginsMap[name] = instance;
				}
			};

		const resultLoadExtras = this.loadExtras(unidit, extrasList);

		return callPromise(resultLoadExtras, () => {
			if (unidit.isInDestruct) {
				return;
			}

			this.items(
				unidit.o.safeMode
					? unidit.o.safePluginsList.concat(
							extrasList.map(s => s.name)
					  )
					: null
			).forEach(makeAndInit);

			this.addListenerOnBeforeDestruct(unidit, plugins);

			(unidit as any).__plugins = pluginsMap;
		});
	}

	/**
	 * Plugin type has disabled requires
	 */
	private hasDisabledRequires(
		disableList: string[],
		requires: string[]
	): boolean {
		return Boolean(
			requires?.length &&
				disableList.some(disabled => requires.includes(disabled))
		);
	}

	/**
	 * Create instance of plugin
	 */
	static makePluginInstance(
		unidit: IUnidit,
		plugin: PluginType
	): Nullable<PluginInstance> {
		try {
			return isFunction(plugin) ? new plugin(unidit) : plugin;
		} catch (e) {
			console.error(e);
			if (!isProd) {
				throw e;
			}
		}

		return null;
	}

	/**
	 * Init plugin if it has not dependencies in another case wait requires plugins will be init
	 */
	private initOrWait(
		unidit: IUnidit,
		pluginName: string,
		instance: PluginInstance,
		doneList: string[],
		promiseList: IDictionary<PluginInstance | undefined>
	) {
		const initPlugin = (name: string, plugin: PluginInstance): boolean => {
			if (isInitable(plugin)) {
				const req = (plugin as IPlugin).requires;

				if (
					!req?.length ||
					req.every(name => doneList.includes(name))
				) {
					try {
						plugin.init(unidit);
					} catch (e) {
						console.error(e);
						if (!isProd) {
							throw e;
						}
					}
					doneList.push(name);
				} else {
					promiseList[name] = plugin;
					return false;
				}
			} else {
				doneList.push(name);
			}

			if ((plugin as IPlugin).hasStyle) {
				PluginSystem.loadStyle(unidit, name);
			}

			return true;
		};

		initPlugin(pluginName, instance);

		Object.keys(promiseList).forEach(name => {
			const plugin = promiseList[name];

			if (!plugin) {
				return;
			}

			if (initPlugin(name, plugin)) {
				promiseList[name] = undefined;
				delete promiseList[name];
			}
		});
	}

	/**
	 * Destroy all plugins before - Unidit will be destroyed
	 */
	private addListenerOnBeforeDestruct(
		unidit: IUnidit,
		plugins: PluginInstance[]
	) {
		unidit.e.on('beforeDestruct', () => {
			plugins.forEach(instance => {
				if (isDestructable(instance)) {
					instance.destruct(unidit);
				}
			});

			plugins.length = 0;

			delete (unidit as any).__plugins;
		});
	}

	/**
	 * Download plugins
	 */
	private load(unidit: IUnidit, pluginList: IExtraPlugin[]): Promise<any> {
		const reflect = (p: Promise<any>) =>
			p.then(
				(v: any) => ({ v, status: 'fulfilled' }),
				(e: any) => ({ e, status: 'rejected' })
			);

		return Promise.all(
			pluginList.map(extra => {
				const url =
					extra.url ||
					PluginSystem.getFullUrl(unidit, extra.name, true);

				return reflect(appendScriptAsync(unidit, url));
			})
		);
	}

	private static async loadStyle(
		unidit: IUnidit,
		pluginName: string
	): Promise<void> {
		const url = PluginSystem.getFullUrl(unidit, pluginName, false);

		if (this.styles.has(url)) {
			return;
		}

		this.styles.add(url);

		return appendStyleAsync(unidit, url);
	}

	private static styles: Set<string> = new Set();

	/**
	 * Call full url to the script or style file
	 */
	private static getFullUrl(
		unidit: IUnidit,
		name: string,
		js: boolean
	): string {
		name = kebabCase(name);

		return (
			unidit.basePath +
			'plugins/' +
			name +
			'/' +
			name +
			'.' +
			(js ? 'js' : 'css')
		);
	}

	private loadExtras(
		unidit: IUnidit,
		extrasList: IExtraPlugin[]
	): CanPromise<void> {
		if (extrasList && extrasList.length) {
			try {
				const needLoadExtras = extrasList.filter(
					extra => !this._items.has(this.normalizeName(extra.name))
				);

				if (needLoadExtras.length) {
					return this.load(unidit, needLoadExtras);
				}
			} catch (e) {
				if (!isProd) {
					throw e;
				}
			}
		}
	}
}
