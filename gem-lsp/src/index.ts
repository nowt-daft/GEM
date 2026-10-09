import * as ts from 'typescript/lib/tsserverlibrary';
import Plugin from './plugin';

import { spawn } from "node:child_process";

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
			const BUILD_SCRIPT = `${ PROJECT_DIR }/BUILD`;

			let child = build(PROJECT_DIR, BUILD_SCRIPT);

			setInterval(
				() => {
					child.kill();
					child = build(PROJECT_DIR, BUILD_SCRIPT);
				},
				20000
			);
		}
	);
}

export = init;
