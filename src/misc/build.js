import { filter, forEach, view_prototype } from "../types/object.js";
import { open, save, list } from "../io/disk.js";
import { join } from "../io/path.js";
import is from "../utils/is.js";

import ClassDescriptor from "../descriptors/class.js";
import MetaDescriptor from "../descriptors/meta.js";
import { Get } from "../descriptors/accessor.js";
import { GetDescriptor } from "../descriptors/getter.js";
import { MetaType } from "../gem.js";

import { parse_args, parse_returns } from "../utils/tagify.js";
import ts from "typescript";


const GEM_JS_EXT = '.gem.js';
const GEM_DTS_EXT = '.gem.d.ts';

const NOTICE = [
	'/*',
	' 💎 GEM :: DEFINITION FILE',
	` 🗐 This file was generated on ${ new Date }.`,
	' ⚠ DO NOT TAMPER WITH THIS FILE AS CHANGES WILL BE LOST.',
	'*/'
];
const NEWLINE = '\n';
const TAB = '\t';


const COMPILED_DTS = {};


/**
 * @param    {...string}  paths
 * @returns  {string}
 */
const compile = (...paths) => {
	const options = {
		allowJs: true,
		declaration: true,
		emitDeclarationOnly: true,
	};

	const output = {};

	try {
		const host = ts.createCompilerHost(options);
		host.writeFile = (
			path,
			contents
		) => output[path] = contents;

		ts.createProgram(
			paths,
			options,
			host
		).emit();
	} catch (e) {
		console.log(`ERROR: ${ e }`);
		return false;
	}

	return Object.assign(
		COMPILED_DTS,
		output
	);
}

/**
 * @param    {string}  path
 * @param    {string}  contents
 * @param    {ClassDescriptor}  type
 * @returns  {[string,string]}  [out_path, contents]
 *
 */
const render = (
	path,
	contents,
	type
) => {
	const dts_file = path.replace(GEM_JS_EXT, GEM_DTS_EXT);

	return [
		dts_file,
		render_file(
			render_imports(contents),
			...(
				type.constructor === MetaType ||
				type.constructor.name !== type.__proto__.name ?
					[
						render_type(type),
						`export default ${ type.name };`
					] :
					[
						render_type(type.__proto__),
						COMPILED_DTS[dts_file].replace(
							`class ${ type.name }`,
							`class ${
								type.name
							} extends ${
								type.__proto__.name ?? 'Object'
							}`
						)
					]
			)
		)
	];
}

/**
 * @param    {string}  rendered_imports
 * @param    {string}  rendered_type
 * @param    {string}  rendered_end
 * @returns  {string}
 */
const render_file = (
	rendered_imports,
	rendered_type,
	rendered_end
) =>
	`${
		NOTICE.join(NEWLINE)
	}${ NEWLINE }${
		rendered_imports
	}${
		rendered_type
	}${
		rendered_end
	}`;

/**
 * @param    {string}  contents
 * @returns  {string}
 */
const render_imports = contents => {
	return contents.split(NEWLINE).filter(
		line => line.startsWith('import')
	).join(NEWLINE) + NEWLINE;
}

/**
 * @param    {ClassDescriptor}  type
 * @returns  {string}
 */
const render_type = type => {
	const { name, prescriptor } = type;
	const declaration =
		`declare class ${ name }` + (
			type.__proto__ === Object.__proto__ ?
				'' :
				` extends ${ type.__proto__.name }`
		);

	let fields = '';

	forEach(
		prescriptor,
		(key, field) =>
			fields += TAB + render_field(key, field) + NEWLINE
	);
	fields += fields ? NEWLINE : '';

	forEach(
		filter(
			view_prototype(type),
			key => ![
				// TODO: This MIGHT move to types/object.js
				'connectedCallback',
				'disconnectedCallback',
				'renderCallback'
			].includes(key)
		),
		(key, method) =>
			fields +=
				TAB +
				render_method(
					type,
					key === 'init' ?
						'constructor' :
						key,
					method
				) +
				NEWLINE
	);

	return `${
		NEWLINE
	}${
		declaration
	} {${
		NEWLINE
	}${
		fields
	}}${
		NEWLINE
	}`;
}

/**
 * @param    {string}  key
 * @param    {MetaDescriptor}  descriptor
 * @returns  {string}
 */
const render_field = (
	key,
	descriptor
) => {
	const { type, is_private, is_nullable } = descriptor;
	const priv = is_private ? 'private ' : '';
	const nullable = is_nullable ? '?' : '';
	const readonly =
		descriptor instanceof GetDescriptor ||
		descriptor instanceof Get ?
			'get ' : '';
	const comment = readonly ? `/** 👀 Getter (readonly) */` + NEWLINE + TAB : '';
	return `${
		comment
	}${
		priv
	}${
		readonly
	}${
		key
	}${
		readonly ? '()' : ''
	}${
		nullable
	}: ${
		(is.lamda(type) ? type() : type)?.name ?? 'any'
	};`;
}

/**
 * @param    {class}     type  Type of which function is member
 * @param    {string}    name  Name of function
 * @param    {Function}  func  Function/method to render
 * @returns  {string}
 */
const render_method = (
	type,
	name,
	func
) => {
	return `${
		name
	}(${
		render_params(func)
	}): ${
		render_returns(
			name === 'constructor' ?
				type :
				func.returns ?? parse_returns(func)
		)
	};`;
}

/**
 * @param    {Function}  func
 * @returns  {string}
 */
const render_params = func => {
	return func.params ?
		Object
			.entries(func.params)
			.map(
				([param, type]) =>
					`${ param }: ${ type.name }`
			)
			.join(', ') :
		parse_args(func);
}

/**
 * @param    {class}  type
 * @returns  {string}
 */
const render_returns = type =>
	type ? type.name : 'unknown';

/**
 * @param    {string}  source
 */
const emit = async source => {
	const [out, contents] = render(
		source,
		await open(source),
		(await import(source)).default
	);

	console.log('*'.repeat(30));
	console.log(contents);
	console.log('*'.repeat(30));
	
	save(out, contents);
}

/**
 * @param  {string}  gem_file  File to compile, baby.
 */
function main(
	gem_file
) {
	if (gem_file !== '.') {
		const files = gem_file.split(":");

		console.log("RECEIVED");
		console.log(files);

		if (
			compile(...files)
		) {
			for (const file of files)
				emit(file);
		}

		return;
	}

	const crawl = (
		path,
		output = []
	) => {
		for (const node of list(path)) {
			output = [
				...output,
				...(
					node.endsWith('/') ?
						crawl(
							join(path, node),
						) :
						node.endsWith(GEM_JS_EXT) ?
							[join(path, node)] :
							[]
				)
			];
		}
		return output;
	}

	const files = crawl(
		join(
			import.meta.dir, // -> <REPO>/src/misc
			'../' // -> <REPO>/src
		)
	);

	if (
		compile(...files)
	) {
		for (const file of files)
			emit(file);
	}

}

const [
	runtime,
	script,
	input
] = process.argv;

let _busy = false;

process.stdin.setEncoding('utf8');

console.log("STARTING:", input);

if (
	runtime.includes('bun') &&
	script === import.meta.path
) {
	if (input === "--service") {
		process.stdin.on(
			"data",
			data => {
				console.log(
					`STATUS: ${
						_busy ? "busy" : "ready"
					}`
				);
				if (_busy)
					return;

				_busy = true;
				main(data);
				_busy = false;
			}
		);
	} else {
		main(input);
	}
}
