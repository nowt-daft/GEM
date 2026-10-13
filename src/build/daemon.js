import { list, open } from "../io/disk.js";
import { diff, join } from "../io/path.js";
import program from "./program.js";
import render from "./render.js";

const MAX_COL_WIDTH = 70;

const CHARS_TO_ESCAPE = /[.*+?^${}()|]/g;

const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';

const WAIT_TIME = 10000;

const [
	runtime,
	script,
	project_dir = process.env.PWD
] = process.argv;

let _time_passed = true;

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

const convert = path => {
	if (path === '*')
		return /^[^\/]+$/;
	if (path === '**/*')
		return /^.+$/;

	const pivot = path.indexOf('/*');
	return new RegExp(
		`^${
			path.slice(
				0,
				pivot > -1 ? pivot : undefined
			).replace(
				CHARS_TO_ESCAPE,
				'\\$&'
			) + (
				path.endsWith('/**/*') ?
					'(\\/.*)?' :
					path.endsWith('/*') ?
						'(\\/[^\//]*)?' :
						''
			)
		}$`
	);
}

/**
 * @param  {string}  project_dir
 * @param  {RegExp[]}  include_dirs
 * @param  {string[]}  exclude_dirs
 * @param  {string}  out_dir
 * @param  {string}  path
 * @param  {string[]}  output
 * @returns  {string[]}
 */
const crawl = (
	project_dir,
	include_dirs,
	exclude_dirs,
	out_dir,
	path = '',
	output = []
) => {
	const abs_path = join(project_dir, path);
	const nodes = list(abs_path);

	for (const node of nodes) {
		const node_path = join(path, node);

		if (exclude_dirs.includes(node_path))
			continue;

		if (node.endsWith('/'))
			output = crawl(
				project_dir,
				include_dirs,
				exclude_dirs,
				out_dir,
				node_path,
				output
			);
		
		else if (
			include_dirs.some(
				dir => dir.test(node_path)
			)
		)
			output = output.concat(join(abs_path, node_path))
	}

	return output;
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

	console.log('='.repeat(MAX_COL_WIDTH));
	console.log(dts);
	console.log('='.repeat(MAX_COL_WIDTH));

	await Bun.write(path, dts);
	await Bun.write(path.replace(TYPES_DIR, ''), dts);
}

console.log(`
${ '*'.repeat(MAX_COL_WIDTH) }
RUNTIME: ${ runtime }
 SCRIPT: ${ script }
    DIR: ${ project_dir }
${ '*'.repeat(MAX_COL_WIDTH) }
`);

if (
	!runtime.includes('bun') ||
	script != import.meta.path
) process.exit(1);

program(
	project_dir,
	async (
		{
			include = ['**/*'],
			exclude = [],
			compilerOptions: { outDir = '@types' }
		},
		path,
		dts
	) => {
		const OUT_DIR = outDir;

		if (_time_passed) {
			_time_passed = false;

			const INCLUDES_REGEX = include.map(
				glob => convert(glob)
			);
			const EXCLUDES = exclude.concat(
				['.git', 'node_modules', OUT_DIR]
			);
			
			const DELETE_QUEUE = crawl(
				project_dir,
				INCLUDES_REGEX,
				EXCLUDES,
				OUT_DIR
			);

			console.log(
				DELETE_QUEUE.join('\n')
			);

			setTimeout(
				() => _time_passed = true,
				WAIT_TIME
			);
		}

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
				`${ OUT_DIR }/`,
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
		
		await save(
			project_dir,
			path,
			dts
		);
	}
);
