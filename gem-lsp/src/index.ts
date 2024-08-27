import * as ts from 'typescript/lib/tsserverlibrary';
import Plugin from './plugin';

import {
	statSync,
	existsSync,
	rmSync,
	readdirSync,
} from 'node:fs';
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';
const GEM_SRC_DIR = 'src';

function init({ typescript: _ }: { typescript: typeof ts }) {
	return new Plugin(
		plugin => {
			const PROJECT_DIR =
				plugin.project.getCurrentDirectory();
			const SRC_DIR = `${ PROJECT_DIR }/${ GEM_SRC_DIR }`;
			const CACHE: Map<string,number> = new Map();

			const emit = (path: string) =>
				spawnSync(
					`${ PROJECT_DIR }/build`,
					[ path ],
					{ cwd: PROJECT_DIR, encoding: 'utf-8' }
				);

			const crawl = (
				path: string,
			) => {
				for (
					const node of
					readdirSync(path, { recursive: true, encoding: 'utf-8' })
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

						CACHE.set(node_path, date_modified);
						emit(node_path);

					} else if (stats.isDirectory())
						crawl(node_path);
				}
			};

			setInterval(
				() => {
					crawl(
						SRC_DIR,
					);
				},
				3000
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
				3000
			);
		}
	);
}

export = init;
