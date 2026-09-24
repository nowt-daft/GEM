import { open, save } from "../io/disk.js";
import { diff } from "../io/path.js";
import program from "./program.js";
import render from "./render.js";

const MAX_COL_WIDTH = 40;
const TYPES_DIR = '@types/'
const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';

/** @type {Map<string,string>} */
const PROGRAM = new Map();

function save_dts(
	path,
	dts
) {
	PROGRAM.set(path, dts);
	// save(path, dts);
}

const [
	runtime,
	script,
	project_dir = process.env.PWD
] = process.argv;

// ## DEBUG ###########################

console.log(`
${ '*'.repeat(MAX_COL_WIDTH) }
RUNTIME: ${ runtime }
 SCRIPT: ${ script }
    DIR: ${ project_dir }
${ '-'.repeat(MAX_COL_WIDTH) }
`);

// ## DONE ############################

if (
	!runtime.includes('bun') ||
	script != import.meta.path
) process.exit(1);

// ## PROGRAM START ###################

program(
	project_dir,
	async (
		path,
		dts
	) => {
		if (
			!path.endsWith(GEM_DTS_EXT)
		)
			return PROGRAM.set(
				path,
				dts
			);

		// ## OVERRIDE .d.ts ##########

		const short_path = diff(project_dir, path);
		console.log(
			'--',
			short_path,
			'-'.repeat(
				Math.max(
					0,
					MAX_COL_WIDTH - 4 - short_path.length
				)
			)
		);

		const js_path =
			path.replace(
				GEM_DTS_EXT,
				GEM_JS_EXT
			).replace(
				TYPES_DIR,
				''
			);

		console.log(
			dts = render(
				project_dir,
				path,
				js_path,
				await open(js_path),
				(await import(js_path)).default,
				dts
			)
		);

		save_dts(
			path,
			dts
		);

		console.log(
			'-- saved',
			'-'.repeat(31)
		);

		// ## DONE ####################
	}
);
