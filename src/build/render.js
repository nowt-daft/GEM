import { view, view_prototype } from "../types/object.js";
import { diff } from "../io/path.js";
import is from "../utils/is.js";

import { FixedProperty } from "../descriptors/property.js";
import MetaDescriptor from "../descriptors/meta.js";
import { Get } from "../descriptors/accessor.js";
import { GetDescriptor } from "../descriptors/getter.js";
import ClassDescriptor from "../descriptors/class.js";

import tagify, { parse_args, parse_returns } from "../utils/tagify.js";

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
const STATIC_IGNORES = [
	'name',
	'length',
	'constructor',
	'static',
	'defines',

	'prescriptor',
	'parents',
	'defaults',
	'properties',
	'listeners',
	'prototype',
];

const TYPE_CONVERSIONS = {
	Boolean: "boolean",
	Symbol: "symbol",
	Number: "number",
	BigInt: "bigint",
	String: "string",
	Object: "object",
	Void: "void",
	Any: "any",
	// Either, Callback, Function?
};

/**
 * @param    {string}  root_path   Project root directory
 * @param    {string}  dts_path    Path to the dts file
 * @param    {string}  js_path     Path to the js file
 * @param    {string}  source      Source code of the js file
 * @param    {ClassDescriptor}  T  The default export from the js file
 * @returns  {string}  Rendered .d.ts file
 */
export default (
	root_path,
	dts_path,
	js_path,
	source,
	T,
	// dts
) => {
	if (!is.class(T))
		return "// THIS FILE HAS FAILED TO EXPORT A DEFAULT GEM TYPE.";

	const {
		name,
		// constructor,
		// __proto__,
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
		render_type(T) + NEWLINE + `export default ${ name };`
	}`;
}

export const render_notice = (
	root_path,
	dts_path,
	js_path,
	T
) => `/*
 * 💎 GEM -> ${ diff(root_path, dts_path) }
 * 📜 ${ T.name }::${
	(name => name == "Function" ? 'class' : name)(T.constructor.name)
}::${
	(parents => parents ? parents : T.__proto__.name || 'Object')(
		T.parents?.map(({ name }) => name).join('::')
	)
}
 * 💾 Generated on ${
	(new Date).toLocaleString([], { hourCycle: "h24" }).replace(', ', '@')
} from ${ diff(root_path, js_path) }
 */
`

/**
 * @param    {string}  type
 * @param    {string}  [message]
 * @returns  {string}
 */
export const render_doc = (
	type,
	message,
	tab = TAB
) => {
	if (!message)
		return '';

	return `${ tab } * @${ type } ${ NEWLINE }` + (
		message
			.split(NEWLINE)
			.map(line => `${ tab } * ${ line }`)
			.join(NEWLINE) + NEWLINE
	) ?? '';
}

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
		parents = [],
		prescriptor = {},
		__proto__ = Object.__proto__
	} = T;

	let class_name = ` * @class ${ name }`;
	let mixes = parents.filter(p => p != __proto__).map(({ name }) => ` * @mixes ${ name }`).join(NEWLINE);
	let declaration = `declare class ${ name }`;

	if (__proto__ !== Object.__proto__) {
		class_name += `\n * @extends ${ __proto__.name }`;
		declaration += ` extends ${ __proto__.name } `;
	}

	return `/**${ NEWLINE }${
		class_name
	}${ NEWLINE }${
		mixes
	}${ mixes ? NEWLINE : '' } */${ NEWLINE }${
		declaration
	} ${ BLOCK_START }${ NEWLINE }${
		render_fields(prescriptor)
	}${ NEWLINE.repeat(2) }${
		render_methods(T)
	}${ NEWLINE.repeat(2) }${
		render_statics(T)
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
	const { type, is_private, is_nullable, writable = true, enumerable = true, get, set } = field;

	const prefix = is_private || !enumerable ? 'private ' : '';
	const getter =
		field instanceof GetDescriptor ||
			field instanceof Get || (get && !set);
	const readonly = field instanceof FixedProperty || !writable;
	const label =
		(readonly || getter) ?
			(getter ? `get ${ key }()` : `readonly ${ key }`) :
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
				`${ render_method(T, key, method) };`
		).join(NEWLINE);

/**
 * @param    {ClassDescriptor}  T
 * @param    {string}  key
 * @param    {Function}  method
 * @param    {boolean}  is_static
 * @returns  {string}  Rendered method with its params and return type
 */
export const render_method = (
	T,
	key,
	method,
	is_static = false
) => {
	if (key == 'init')
		key = 'constructor';

	const rtrns =
		key === 'constructor' ?
			'' :
			(key == 'inherit' || key == 'super') ?
				T.name :
				(method?.returns?.name ?? parse_returns(method));

	const method_name = `${ TAB } * @method ${ key }` + NEWLINE;
	const description = render_doc('description', method.description);
	const example = render_doc('example', method.example);
	const static_label = is_static ? 'static ' : '';

	return `${ TAB }/**${ NEWLINE }${
		method_name
	}${
		description
	}${
		example
	}${ TAB } */${ NEWLINE }${ TAB }${ static_label }${
		key
	}${ GROUP_START }${
		// key === 'super' ?
		// 	`...arg_collection: [${
		// 		T.parents?.filter(
		// 			p => p !== T.__proto__
		// 		)
		// 		.map(
		// 			p => `[${ p.prototype.init ? render_params(p.prototype.init) : '{}' }]`
		// 		).join(',') ?? ''
		// 	}]` : 
			render_params(method)
	}${ GROUP_END }${ rtrns ? ': ' + render_type_name(rtrns) : '' }`;
}

/**
 * @param    {Function}  method
 * @returns  {string}  Returns paramaters of parsed method as a string.
 */
export const render_params =
	method => method.params ?
		Object.entries(method.params).map(
			([param, field]) => {
				if (
					!(field instanceof MetaDescriptor)
				)
					return `${ param }: ${ field.name ?? 'unknown' }`;
				
				const null_suffix = field.is_nullable ? '?' : '';
				const type = render_type_name(field.type.name);
				
				return `${ param }${ null_suffix }: ${ type }`
			}
		).join(', ') :
		parse_args(method);

/**
 * @param    {string}  type_name
 * @returns  {string}  Modified name better suited for .d.ts files
 */
export const render_type_name = type_name => TYPE_CONVERSIONS[type_name] ?? type_name;

export const render_statics = T => {
	if (
		T.constructor === T.__proto__.constructor
	) {
		return render_statics(T.__proto__);
	}
	const statics = Object.entries(
		view(T)
	)
		.filter(
			([key]) => !STATIC_IGNORES.includes(key)
		);
	return statics.map(
			([
				key,
				value
			]) => {
				if (is.method(value))
					return `${ render_method(T, key, value, true) };`;

				const field = {
					...Object.getOwnPropertyDescriptor(T, key),
					type: value.constructor
				};
				return (
					`${
						TAB
					}static ${
						render_field(key, field)
					// } = ${
					// 	tagify(value)
					};`
				);
			}
	).join(NEWLINE);
}
