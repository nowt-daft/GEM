import * as ts from 'typescript/lib/tsserverlibrary';
import Plugin from './plugin';

import { spawn } from "node:child_process";
import { existsSync as exists } from "node:fs";

function build(cwd: string, script: string) {
	return spawn(
		script,
		[],
		{ cwd }
	);
}

function init({ typescript: _ }: { typescript: typeof ts }) {
	return new Plugin(
		plugin => {
			const PROJECT_DIR =
				plugin.project.getCurrentDirectory();
			const GEM_DIR = `${ PROJECT_DIR }/node_modules/GEM`;
			const BUILD_SCRIPT = `${
				exists(GEM_DIR) ?
					GEM_DIR :
					PROJECT_DIR
			}/BUILD`;

			let child = build(PROJECT_DIR, BUILD_SCRIPT);
		}
	);
}

export = init;
