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

			// setInterval(
			// 	() => {
			// 		child.on(
			// 			'exit',
			// 			() => child = build(PROJECT_DIR, BUILD_SCRIPT)
			// 		);
			// 		child.kill('SIGTERM');
			//
			// 		setTimeout(
			// 			() => {
			// 				if (!child.killed)
			// 					child?.kill('SIGKILL');
			// 			},
			// 			5000
			// 		);
			// 	},
			// 	600000
			// );
		}
	);
}

export = init;
