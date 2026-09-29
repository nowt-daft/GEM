import { open } from "../io/disk.js";
import { diff } from "../io/path.js";
import program from "./program.js";
import render from "./render.js";

const MAX_COL_WIDTH = 40;
const TYPES_DIR = '@types/'
const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';

const [
	runtime,
	script,
	project_dir = process.env.PWD
] = process.argv;

const print = (
	project_dir,
	path
) => {
	const short_path = diff(project_dir, path).slice(1);
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
}

const save = async (
	project_dir,
	path,
	dts
) => {
	print(
		project_dir,
		path
	);

	console.log(dts);

	// console.log('-'.repeat(40));
	return Bun.write(path, dts);
}

console.log(`
${ '*'.repeat(MAX_COL_WIDTH) }
RUNTIME: ${ runtime }
 SCRIPT: ${ script }
    DIR: ${ project_dir }
${ '-'.repeat(MAX_COL_WIDTH) }
`);

if (
	!runtime.includes('bun') ||
	script != import.meta.path
) process.exit(1);

program(
	project_dir,
	async (
		path,
		dts
	) => {
		if (
			!path.endsWith(GEM_DTS_EXT)
		) {
			print(
				project_dir,
				path
			);
			return await Bun.write(
				path,
				dts
			);
		}

		const js_path =
			path.replace(
				GEM_DTS_EXT,
				GEM_JS_EXT
			).replace(
				TYPES_DIR,
				''
			);

		dts = render(
			project_dir,
			path,
			js_path,
			await open(js_path),
			(await import(js_path)).default,
			dts
		);
		
		return save(
			project_dir,
			path,
			dts
		);
	}
);
