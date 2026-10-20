import * as ts from 'typescript/lib/tsserverlibrary';
import Plugin from './plugin';

import { spawn } from "node:child_process";
import { existsSync as exists } from "node:fs";

function build(cwd: string, gem_dir: string) {
	return spawn(
		`${ gem_dir }/BUILD`,
		[
			gem_dir,
			cwd
		],
		{ cwd }
	);
}

function init({ typescript: _ }: { typescript: typeof ts }) {
	return new Plugin(
		plugin => {
			const PROJECT_DIR =
				plugin.project.getCurrentDirectory();
			const GEM_DIR = `${ PROJECT_DIR }/node_modules/GEM`;

			let child = build(
				PROJECT_DIR,
				exists(GEM_DIR) ?
					GEM_DIR :
					PROJECT_DIR
			);
		}
	);
}

export = init;
