import { log as print } from 'console';

import './utils/object.js';
import is from './utils/is.js';

import retrofits from './utils/boostrap.js';

import Properties from './descriptors/properties.js';
import Accessor from './descriptors/accessor.js';
import TypeDescriptor from './descriptors/type_descriptor.js';

const PLUS = '+';
const EMPTY = '';
const ARROW = '>';

const satisfies =
	(Type1, Type2) =>
		Type1 === Type2 ||
		(
			Type1?.parents?.length ?
				Type1
					.parents
					.some(
						t => satisfies(t, Type2)
					) :
				Type1?.__proto__ &&
				Type1.__proto__ !== Object.__proto__ ?
					satisfies(
						Type1.__proto__, // TODO: types need a __proto__
						Type2
					) :
					Type2 === Object // false otherwise
		);

const STATIC = {
	expression: /.*/,
	static(properties) {
		return (
			properties ?
				Object.defineProperties(
					this,
					Properties.static(
						properties
					)
				) :
				this
		);
	},
	parse(string) {
		return new this(string);
	},
	stringify(instance) {
		return `${instance}`;
	},
	validate(string) {
		return this.expression.test(string);
	},
	defines(instance) {
		return satisfies(
			instance?.constructor,
			this
		);
	},
	List: Accessor.Get(Type => {
		return List(Type);
	}),
	[Symbol.hasInstance](instance) {
		return (
			is.string(instance) ?
				this.validate(instance) :
				this.defines(instance)
		);
	}
};

export class Constructor {
	static Object(
		name
	) {
		const constructor = {
			[name]: function(...args) {
				return Object.init(
					is.global(this) ?
						Object.create(
							{
								...constructor.prototype,
								constructor
							},
							constructor.properties
						) :
						this,
					...args
				);
			}
		}[name];
		return constructor;
	}

	static Function() {
		// TODO: implement...
	}

	static Class(
		name
	) {
		return {
			[name]: class {
				constructor(...arg_collection) {
					this.super(
						...arg_collection
					);
					Object.init(
						this,
						...arg_collection
					);
				}
			}
		}[name];
	}

	static Extension(
		base,
		name
	) {
		return {
			[name]: class extends base {
				constructor(...args) {
					super(
						...args
					);
					Object.init(
						this,
						...args
					);
				}
			}
		}[name];
	}
}

export class Format {
	static Abstract(
		name
	) {
		const Abstract = {
			[name]: class {
				constructor() {
					if (this.constructor === Abstract)
						throw new TypeError(
							`CONSTRUCTOR ERROR: Cannot create instance of abstract ${ name }.`
						);
				}
			}
		}[name];
		return Abstract;
	}

	static Model(name) {
		return Constructor.Object(name);
	}

	static Function() {
		// TODO: implement
	}

	static Class(
		name,
		{ parents = [] }
	) {
		return (
			Constructor.Class(
				name + (
					parents.length ?
						ARROW +
						(
							parents
								.map(
									parent =>
										parent.name
								)
								.join(PLUS)
						) :
						EMPTY
				)
			)
		);
	}

	static Extension(
		name,
		{
			parents: [base, ...parents]
		}
	) {
		if (!base)
			base = Object; // <-- Test...
		return (
			Constructor.Extension(
				base,
				name + ARROW + (
					parents.length ?
						(
							[
								base,
								...parents
							]
								.map(
									parent =>
										parent.name
								)
								.join(PLUS)
						) :
						base.name
				)
			)
		);
	}
}

export function MetaType(
	meta_name,
	formatter = (
		name = '',
		type_descriptor = {}
	) => new Function,
	statics = {}
) {
	if (!is.global(this))
		throw new SyntaxError(
			`SYNTAX ERROR: cannot use new keyword. MetaType does not construct objects.`
		);
	
	const Type = {
		[meta_name]: function(
			name,
			...descriptors
		) {
			if (
				is.global(this) &&
				!descriptors.length &&
				is.constructable(name)
			)
				return Object.defineProperties(
					name,
					Properties.static(
						STATIC
					)
				);
			
			if (
				is.raw_object(name) ||
				is.constructable(name)
			)
				return Type(
					meta_name,
					name,
					...descriptors
				);

			const {
				parents = [],
				prescriptor = {},
				properties = {},
				prototype = {},
				defaults = {},
				listeners = {}
			} =
				new TypeDescriptor(
					...descriptors
				);

			const constructor = formatter(
				is.function(name) ?
					name({
						parents,
						prescriptor
					}) :
					name,
				{
					parents,
					prescriptor,
					properties,
					prototype,
					defaults,
					listeners
				},
			);
			const type =
				Object.defineProperties(
					constructor,
					Properties.static(
						{
							...STATIC,
							...statics,
							
							constructor: Type,
							parents: [
								...constructor.parents ?? [],
								...parents
							],
							prescriptor: {
								...constructor.prescriptor ?? {},
								...prescriptor
							},
							properties: {
								...constructor.properties ?? {},
								...properties
							},
							defaults: {
								...constructor.defaults ?? {},
								...defaults
							},
							listeners: {
								...constructor.listeners ?? {},
								...listeners
							}
						},
						false
					)
				);
	
			Object.defineProperties(
				type.prototype,
				Properties.static(
					prototype,
					false
				)
			);

			return (
				is.global(this) ?
					type :
					Object.inherit(
						this,
						type
					)
			);
		}
	}[meta_name];

	return Object.assign(
		Type(Type),
		{
			constructor: MetaType
		}
	);
}

export const Type =
	MetaType(
		'Type',
		Format.Class
	);

export const Abstract =
	MetaType(
		'Abstract',
		Format.Abstract
	);

export const Model =
	MetaType(
		'Model',
		Format.Model
	);

// export const Function =
// 	MetaType(
// 		'Function',
// 		() => /* TODO: IMPLEMENT */ undefined
// 	);

export const Class =
	MetaType(
		'Class',
		Format.Extension
	);

export const Interface =
	MetaType(
		'Interface',
		Format.Abstract,
		{
			defines(instance) {
				return Object.entries(
					this.prescriptor ?? {}
				).every(
					(
						[
							key,
							descriptor
						]
					) => {
						const value = instance[key];
						return (
							descriptor._required &&
							is.defined(value) &&
							value instanceof descriptor.type
						);
					}
				)
			}
		}
	);

export const List =
	MetaType(
		'List<T>',
		Format.Abstract,
		{
			defines(array) {
				return array.every(
					item =>
						item instanceof this.parents[0]
				);
			},
			parse(string) {
				return string
					.split(',')
					.map(
						x => x.trim()
					)
					.filter(
						x => x
					)
					.map(
						x =>
							this.constructor
								.parse(x)
					);
			},
			stringify(array) {
				return array
					.map(
						x =>
							this.constructor
								.stringify(x)
								.replaceAll(
									',',
									'\,' // <-- this it?
								)
					)
					.join(',');
			}
		}
	).bind(
		this,
		({ parents: [Type] }) =>
			`List<${ Type.name }>`
	);

retrofits.forEach(
	(
		[
			type,
			static_descriptor
		]
	) =>
		Type(type)
			.static(
				static_descriptor
			)
);
