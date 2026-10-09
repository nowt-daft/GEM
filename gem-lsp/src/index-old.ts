import * as ts from 'typescript/lib/tsserverlibrary';
import Plugin from './plugin';

import {
	readFileSync,
	statSync,
	existsSync,
	rmSync,
	readdirSync,
} from 'node:fs';

import { spawn } from "node:child_process";
import { join } from "node:path";

const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';
const GEM_SRC_DIR = 'src';

function parse_env(file: string): Record<string,string> {
	const contents = readFileSync(file, { encoding: "utf-8" });
	const entries = contents.split("\n").filter(x => x).map(
		line => line.split('=')
	);
	return Object.fromEntries(entries);
}

function init({ typescript: _ }: { typescript: typeof ts }) {
	return new Plugin(
		plugin => {
			const PROJECT_DIR =
				plugin.project.getCurrentDirectory();
			const SRC_DIR = `${ PROJECT_DIR }/${ GEM_SRC_DIR }`;
			const CACHE: Map<string,number> = new Map();

			const settings = parse_env(`${ PROJECT_DIR }/.env`);

			const child = spawn(
				settings['BUN_RUNTIME'],
				[
					"run",
					"--no-telemetry",
					"--preload",
					`${ PROJECT_DIR }/src/misc/dom.js`,
					`${ PROJECT_DIR }/src/misc/build.js`,
					"--service"
				],
				{ cwd: PROJECT_DIR }
			);

			const emit = (path: string[]) => {
				child.stdin.write(path.join(":"));
			};

			const crawl = (
				path: string,
				output: string[] = []
			): string[] => {
				for (
					const node of
					readdirSync(
						path,
						{ recursive: true, encoding: 'utf-8' }
					)
				) {
					const node_path = join(path, node);
					const stats = statSync(node_path);

					if (node.endsWith(GEM_JS_EXT)) {
						const date_modified = stats.mtimeMs;

						if (
							CACHE.has(node_path) &&
							CACHE.get(node_path)! === date_modified &&
							existsSync(
								node_path.replace(
									GEM_JS_EXT,
									GEM_DTS_EXT
								)
							)
						) continue;

						// CACHE.set(node_path, date_modified);
						output.push(node_path);

					} else if (stats.isDirectory())
						output.push(...crawl(node_path));
				}

				return output;
			};

			setInterval(
				() => emit(
					crawl(SRC_DIR)
				),
				5000
			);

			setInterval(
				() => {
					for (const path of CACHE.keys()) {
						if (!existsSync(path)) {
							CACHE.delete(path);
							const dts = path.replace(
								GEM_JS_EXT,
								GEM_DTS_EXT
							);
							if (existsSync(dts))
								rmSync(dts);
						}
					}
				},
				10000
			);
		}
	);
}

export = init;
