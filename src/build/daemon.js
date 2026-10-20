import { list } from "../io/disk.js";
import { diff, join } from "../io/path.js";
import program from "./program.js";

const MAX_COL_WIDTH = 70;

const CHARS_TO_ESCAPE = /[.*+?^${}()|]/g;

const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';

const WAIT_TIME = 60000;

const [
	runtime,
	script,
	project_dir = process.env.PWD,
	gem_dir = project_dir
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

const get_source_path = (path, out) =>
	path.replace(
		GEM_DTS_EXT,
		GEM_JS_EXT
	).replace(
		`${ out }/`,
		''
	);

/**
 * @param  {string}  project_dir
 * @param  {RegExp[]}  include_dirs
 * @param  {string[]}  exclude_dirs
 * @param  {string}  out_dir
 * @param  {string}  path
 * @param  {string[]}  output
 * @returns  {Promise<string[]>}
 */
const crawl = async (
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

		if (node.endsWith('/')) {
			output = await crawl(
				project_dir,
				include_dirs,
				exclude_dirs,
				out_dir,
				node_path,
				output
			);
		} else if (
			node.endsWith(GEM_DTS_EXT) &&
			include_dirs.some(
				dir => dir.test(node_path)
			)
		) {
			const full_dts_path = join(abs_path, node);
			const full_src_path = get_source_path(full_dts_path);
			const full_out_path = join(project_dir, out_dir, node_path);

			if (
				!(await Bun.file(full_src_path).exists())
			)
				output = output.concat(full_dts_path);
			if (
				!(await Bun.file(full_out_path).exists())
			)
				output = output.concat(full_out_path);
		}
	}

	return output;
}

/**
 * @param   {string}    project_dir
 * @param   {string[]}  include
 * @param   {string[]}  exclude
 * @param   {string}    out
 * @returns {void}
 */
const init_crawl = async (
	project_dir,
	include,
	exclude,
	out
) => {
	const OUT_DIR = out;
	const INCLUDES_REGEX = include.map(
		glob => convert(glob)
	);
	const EXCLUDES = exclude.concat(
		['node_modules', OUT_DIR]
	);
	
	const DELETE_QUEUE = await crawl(
		project_dir,
		INCLUDES_REGEX,
		EXCLUDES,
		OUT_DIR
	);

	console.log('!'.repeat(MAX_COL_WIDTH));
	DELETE_QUEUE.forEach(
		full_dts_path => {
			console.log('- [DELETE]', full_dts_path);
			del(full_dts_path);
		}
	);
	console.log('!'.repeat(MAX_COL_WIDTH));
}

/**
 * @param   {string}  full_path
 */
const del = full_path => {
	return void Bun.file(full_path).delete();
}

const save = async (
	project_dir,
	path,
	dts,
	out
) => {
	print(
		project_dir,
		path
	);

	console.log('='.repeat(MAX_COL_WIDTH));
	console.log(dts);
	console.log('='.repeat(MAX_COL_WIDTH));

	await Bun.write(path, dts);
	await Bun.write(path.replace(`${ out }/`, ''), dts);
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

			init_crawl(
				project_dir,
				include,
				exclude,
				OUT_DIR
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

		const js_path = get_source_path(path, OUT_DIR);

		dts = Bun.spawnSync({
			cmd: [
				"bun", "run", "--no-telemetry",
				"--preload", `${ gem_dir }/src/misc/dom.js`,
				`${ gem_dir }/src/build/render.js`,
				project_dir,
				path,
				js_path
			]
		}).stdout.toString();
		
		await save(
			project_dir,
			path,
			dts,
			OUT_DIR
		);
	},
	({
		include = ['**/*'],
		exclude = [],
		compilerOptions: { outDir = '@types' }
	}) => {
		init_crawl(
			project_dir,
			include,
			exclude,
			outDir
		);
	}
);
