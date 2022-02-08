/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * [[include:README.md]]
 * @packageDocumentation
 * @module unidit
 */

import './styles';

declare function require(moduleName: string): any;

if (process.env.TARGET_ES !== 'es2018' && typeof window !== 'undefined') {
	require('unidit/polyfills');
}

import { Unidit as DefaultUnidit } from 'unidit/unidit';

import Languages from 'unidit/langs/';

import * as decorators from 'unidit/core/decorators';
import * as consts from 'unidit/core/constants';
import * as Modules from 'unidit/modules/';
import * as Plugins from 'unidit/plugins/';
import * as Icons from 'unidit/styles/icons/';

// copy constants in Unidit
Object.keys(consts).forEach((key: string) => {
	(DefaultUnidit as any)[key] = (consts as any)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons)
	.filter(esFilter)
	.forEach((key: string) => {
		Modules.Icon.set(key.replace('_', '-'), (Icons as any)[key]);
	});

// Modules
Object.keys(Modules)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultUnidit.modules[key] = (Modules as any)[key];
	});

// Decorators
Object.keys(decorators)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultUnidit.decorators[key] = (decorators as any)[key];
	});

['Confirm', 'Alert', 'Prompt'].forEach((key: string) => {
	(DefaultUnidit as any)[key] = (Modules as any)[key];
});

// Plugins
Object.keys(Plugins)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultUnidit.plugins.add(key, (Plugins as any)[key]);
	});

// Languages
Object.keys(Languages)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultUnidit.lang[key] = (Languages as any)[key];
	});

export { DefaultUnidit as Unidit };
