/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module types
 */

import { IViewOptions, IViewWithToolbar } from './view';
import type { Config } from 'unidit/config';
import type { CustomCommand, ICreate, IObserver, IStatusBar, Modes } from '.';
import type { IUploader } from './uploader';
import type { IFileBrowser } from './file-browser';
import { ISelect } from './select';

interface IWorkPlace {
	editor: HTMLDivElement | HTMLBodyElement;
	element: HTMLElement;
	container: HTMLDivElement;
	workplace: HTMLDivElement;
	statusbar: IStatusBar;
	iframe?: HTMLIFrameElement | void;
	editorWindow: Window;
	observer: IObserver;
	options: IViewOptions;
}

interface IUnidit extends IViewWithToolbar {
	isUnidit: true;

	options: Config;
	observer: IObserver;
	editor: HTMLElement;
	element: HTMLElement;

	getNativeEditorValue(): string;
	getEditorValue(
		removeSelectionMarkers?: boolean,
		consumer?: string
	): string;
	setEditorValue(value?: string): void;

	getReadOnly(): boolean;
	setReadOnly(enable: boolean): void;

	places: IWorkPlace[];
	currentPlace: IWorkPlace;
	addPlace(source: HTMLElement | string, options?: IViewOptions): void;
	setCurrentPlace(place: IWorkPlace): void;

	value: string;
	text: string;

	editorDocument: HTMLDocument;

	waitForReady(): Promise<IUnidit>;

	/**
	 * Alias for this.ed
	 */
	ed: this['editorDocument'];

	editorWindow: Window;

	/**
	 * Alias for this.ed
	 */
	ew: this['editorWindow'];

	createInside: ICreate;

	selection: ISelect;

	/**
	 * Alias for this.selection
	 */
	s: this['selection'];

	/**
	 * Return current real work mode. When editor in MODE_SOURCE or MODE_WYSIWYG it will
	 * return them, but then editor in MODE_SPLIT it will return MODE_SOURCE if
	 * Textarea(CodeMirror) focused or MODE_WYSIWYG otherwise
	 *
	 * @example
	 * ```javascript
	 * var editor = new Unidit('#editor');
	 * console.log(editor.getRealMode());
	 * ```
	 */
	getRealMode(): Modes;
	getMode(): Modes;
	mode: Modes;
	isEditorMode(): boolean;
	toggleMode(): void;

	editorIsActive: boolean;

	execCommand(command: string, showUI?: any, value?: null | any): any;
	nativeExecCommand(
		command: string,
		showUI?: any,
		value?: null | any
	): boolean;

	registerCommand(
		commandNameOriginal: string,
		command: CustomCommand<IUnidit>,
		options?: {
			stopPropagation: boolean;
		}
	): IUnidit;

	registerHotkeyToCommand(
		hotkeys: string | string[],
		commandName: string,
		shouldStop?: boolean
	): void;

	/**
	 * workplace It contains source and wysiwyg editors
	 */
	workplace: HTMLDivElement;

	statusbar: IStatusBar;

	uploader: IUploader;
	filebrowser: IFileBrowser;

	iframe?: HTMLIFrameElement | void;
}
