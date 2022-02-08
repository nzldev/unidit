/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */

import './files.less';
import { UIGroup } from 'unidit/core/ui';

export class FileBrowserFiles extends UIGroup {
	override className(): string {
		return 'FilebrowserFiles';
	}
}
