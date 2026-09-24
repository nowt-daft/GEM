import { view_prototype } from "../types/object.js";
import { diff } from "../io/path.js";
import is from "../utils/is.js";

import ClassDescriptor from "../descriptors/class.js";
import MetaDescriptor from "../descriptors/meta.js";
import { Get } from "../descriptors/accessor.js";
import { GetDescriptor } from "../descriptors/getter.js";
import { MetaType } from "../gem.js";

import { parse_args, parse_returns } from "../utils/tagify.js";

const TAB = '\t';
const NEWLINE = '\n';
const BLOCK_START = '{';
const BLOCK_END = '}';
const GROUP_START = '(';
const GROUP_END = ')';

const HTML_CALLBACKS = [
	'connectedCallback',
	'disconnectedCallback',
	'renderCallback'
];

/**
 * @param    {string}  root_path   Project root directory
 * @param    {string}  dts_path    Path to the dts file
 * @param    {string}  js_path     Path to the js file
 * @param    {string}  source      Source code of the js file
 * @param    {ClassDescriptor}  T  The default export from the js file
 * @param    {string}  dts         Definition code for the js file
 * @returns  {string}  Rendered .d.ts file
 */
export default (
	root_path,
	dts_path,
	js_path,
	source,
	T,
	dts
) => {
	const {
		name,
		constructor,
		__proto__,
	} = T;
	return `${
		render_notice(
			root_path,
			dts_path,
			js_path,
			T
		)
	}${ NEWLINE }${
		render_imports(source)
	}${ NEWLINE.repeat(2) }${
		constructor === MetaType ||
		constructor.name !== __proto__.name ?
			render_type(T) + NEWLINE + `export default ${ name };` :
			render_type(__proto__) + NEWLINE + dts.replace(
				`class ${ name }`,
				`class ${
					name
				} extends ${
					__proto__.name ?? 'Object'
				}`
			)
	}`;
}

export const render_notice = (
	root_path,
	dts_path,
	js_path,
	T
) => `
/*
 * 💎 GEM -> ${ diff(root_path, dts_path) }
 * 📜 ${ T.name }::${
	(name => name == "Function" ? 'class' : name)(T.constructor.name)
}::${
	(parents => parents ? parents : T.__proto__.name || 'Object')(
		T.parents?.map(({ name }) => name).join('|')
	)
}
 * 💾 Generated on ${
	(new Date).toLocaleString([], { hourCycle: "h24" }).replace(', ', '@')
} from ${ diff(root_path, js_path) }
 */
`

/**
 * @param    {string}  source  JS source code from file
 * @returns  {string}  All lines starting with the import tag
 */
const render_imports = source =>
	source
		.split(NEWLINE)
		.filter(
			line => line.startsWith('import')
		)
		.join(NEWLINE);

/**
 * @param    {ClassDescriptor}  T  Type for which to render definition
 * @returns  {string}  Definition for the given type T
 */
export const render_type = T => {
	const {
		name,
		prescriptor = {},
		__proto__ = Object.__proto__
	} = T;

	let declaration = `declare class ${ name }`;

	if (__proto__ !== Object.__proto__)
		declaration += ` extends ${ __proto__.name } `;

	return `${
		declaration
	} ${ BLOCK_START }${ NEWLINE }${
		render_fields(prescriptor)
	}${ NEWLINE.repeat(2) }${
		render_methods(T)
	}${ NEWLINE }${ BLOCK_END }`;
}

/**
 * @param    {Record<string,MetaDescriptor>}  prescriptor
 * @returns  {string}  Rendered lines for each public field
 */
export const render_fields =
	prescriptor =>
		Object
			.entries(prescriptor)
			.map(
				([
					key,
					field
				]) =>
					`${ TAB }${ render_field(key, field) };`
			)
			.join(NEWLINE);

/**
 * @param    {string}  key
 * @param    {MetaDescriptor}  field
 * @returns  {string}  A rendered line representing a public field.
 */
export const render_field = (
	key,
	field
) => {
	const { type, is_private, is_nullable } = field;

	const prefix = is_private ? 'private ' : '';
	const readonly =
		field instanceof GetDescriptor ||
			field instanceof Get;
	const label =
		readonly ?
			`get ${ key }()` :
			(key + (is_nullable ? '?' : ''));
	const rtrn = (
		is.lamda(type) ? type() : type
	)?.name ?? 'any';
	
	return `${ prefix }${ label }: ${ rtrn }`;
}

/**
 * @param    {ClassDescriptor}  T  The type from which to parse the prototype
 * @returns  {string}  The rendered methods that exists on the prototype
 */
export const render_methods =
	T =>
		Object.entries(
			view_prototype(T)
		).filter(
			([key]) => !HTML_CALLBACKS.includes(key)
		).map(
			([
				key,
				method
			]) =>
				`${ TAB }${ render_method(T, key, method) };`
		).join(NEWLINE);

/**
 * @param    {ClassDescriptor}  T
 * @param    {string}  key
 * @param    {Function}  method
 * @returns  {string}  Rendered method with its params and return type
 */
export const render_method = (
	T,
	key,
	method
) => {
	let rtrns = "";

	if (key !== 'init')
		rtrns = method?.returns?.name ?? parse_returns(method);
	else {
		key = 'constructor';
		rtrns = T.name;
	}

	return `${
		key
	}${ GROUP_START }${
		render_params(method)
	}${ GROUP_END }: ${ rtrns }`;
}

/**
 * @param    {Function}  method
 * @returns  {string}  Returns paramaters of parsed method as a string.
 */
export const render_params =
	method => method.params ?
		Object.entries(method.params).map(
			([param, type]) => {
				const { name, is_nullable } = type instanceof MetaDescriptor ? type.type : type;
				return `${ param }: ${ name }` + (is_nullable ? '?' : '')
			}
		).join(', ') :
		parse_args(method);
