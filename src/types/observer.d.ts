/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

/**
 * @module types
 */

import type { CallbackFunction, CanUndef, IComponent, SnapshotType } from './types';

export interface IObservable {
	on(event: string | string[], callback: CallbackFunction): this;
}

export interface ICommand {
	undo(): void;
	redo(): void;
}

export interface IStack {
	clear(): void;
	push(command: ICommand): void;
	replace(command: ICommand): void;
	current(): CanUndef<ICommand>;
	undo(): boolean;
	redo(): boolean;
	canUndo(): boolean;
	canRedo(): boolean;
}

export interface ISnapshot {
	make(): SnapshotType;
	restoreOnlySelection(snapshot: SnapshotType): void;
	restore(snapshot: SnapshotType): void;
}

export interface IObserver extends IComponent {
	stack: IStack;
	snapshot: ISnapshot;
	redo(): void;
	undo(): void;
	clear(): void;
	replaceSnapshot(): void;
	upTick(): void;
}
