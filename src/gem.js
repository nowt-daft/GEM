import is from "./utils/is.js";
import tagify from "./utils/tagify.js";
import { init, construct, map } from "./types/object.js";

import Property from "./descriptors/property.js";
import Properties from "./descriptors/properties.js";

import Descriptor from "./descriptors/descriptor.js";
import MetaDescriptor from "./descriptors/meta.js";

// import Getter from "./descriptors/getter.js";
export { default as Getter } from "./descriptors/getter.js";

import { Field } from "./descriptors/field.js";
export { default as Field } from "./descriptors/field.js";

import Method from "./descriptors/method.js";
import ClassDescriptor from "./descriptors/class.js";

import MetaTypeError from "./errors/metatype.js";
import AbstractError from "./errors/abstract.js";


import bootstrap from "./misc/bootstrap.js";
import ArgumentError from "./errors/argument.js";

const to_descriptors = (key, value) => [
	key,
	(
		is.object_literal(value) &&
		is.method(value.method) &&
		is.class(value.returns)
	) ? Property.fixed(Method(key, value), true) :
		value instanceof MetaDescriptor ? value.init(key) :
			is.class(value) ? Field.type(value).init(key) :
				value instanceof Descriptor ? value :
					Property.fixed(value, true)

];

/**
 * @mixin STATIC
 */
export const STATIC = {
	expression: /.*/i,

	validate: {
		description: "Validates if the given string can be parsed into this type.",
		params: {
			str: String
		},
		method(str) {
			return this.expression.test(str)
		},
		returns: Boolean
	},

	parse: {
		description: "Uses the given string to construct an instance of this type. By default, the constructor of the type is called.",
		params: {
			str: String
		},
		method(str) {
			return new this(str);
		},
		returns: Object
	},

	stringify: {
		description: "Converts our instance into a string representation of itself.",
		params: {
			instance: Object,
		},
		method(instance) {
			return `${ instance }`;
		},
		returns: String
	},

	serialise: {
		description: "Intermediary step from instance to string. This is needed for some types.",
		example: "[TODO] Please provide a solid example...",
		params: {
			instance: Object
		},
		method(instance) {
			return instance;
		},
		returns: Object
	},

	/**
	 * @param   {object}   properties
	 * @param   {boolean}  enumerable
	 * @returns {object}   this
	 */
	static(
		properties,
		enumerable = false
	) {
		console.log('"'.repeat(60));
		console.log(this);
		console.log('"'.repeat(60));
		return Object.defineProperties(
			this,
			Properties.fixed(
				properties,
				enumerable
			)
		);
	},

	defines: {
		description: "Is this type or one of its parents the constructor for the given instance.",
		params: {
			// instance: Any,
		},
		method(instance) {
			return is.of_type(instance, this);
		},
		returns: Boolean
	},

	/**
	 * Metaprogramming -> hooks into "instanceof" keyword
	 * @example
	 * 43 instanceof Number
	 *
	 * @returns  {boolean}
	 */
	[Symbol.hasInstance](instance) {
		return is.string(instance) ?
			this.validate(instance) :
			this.defines(instance);
	},

	// TODO: We shall figure this one out.
	// Probably just Get from accessor.js
	// get list() {
	// 	return List(this);
	// }
}

/**
 * @callback ConstructorFormatter
 * @param    {string}  name  Name of the class/type.
 * @param    {ClassDescriptor}  descriptor  Info about type (parents, properties, etc.)
 * @returns  {new *}  Factory that builds types/constructors/classes.
 */

/**
 * @callback  Name
 * @param     {ClassDescriptor}  descriptor
 * @returns   {string}           name to assign
 */

/**
 * A Type Factory helps us define Types ad generate them.  This
 * means we can call this as a function and it will return a
 * kind of CONSTRUCTOR (be it a class or otherwise).
 * It can also be extended directly by a class OR called with the
 * NEW keyword to skip the creation of the specific type and straight
 * to the desired instance of the Type.
 *
 * If name is absent, there must be:
 *     at least TWO parents; OR
 *     at least ONE parent and ONE definition; OR
 *     ONE definition.
 * If parents are absent, there must be:
 *     ONE definition.
 *     name is optional.
 * If definition is absent, there must be:
 *     at least TWO parents.
 *
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 *//**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
function TypeConstructor() {};

export class Constructor {
	/**
	 * @param    {string}  name  Name for the object constructor.
	 * @returns  {new *}   Constructor for building objects.
	 */
	static Object(name) {
		const constructor = {
			[name]: function(...args) {
				return construct(
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

	/**
	 * @param    {string}  name  Name for the class to have.
	 * @returns  {new *}   Class for building objects.
	 */
	static Class(name) {
		return {
			[name]: class {
				constructor(...arg_collection) {
					this.super(
						...arg_collection
					);
					construct(
						this,
						...arg_collection
					);
				}
			}
		}[name];
	}

	/**
	 * @param    {new *}   base   Base class to directly extend.
	 * @param    {string}  name   Name for the child class to have.
	 * @returns  {new *}  Class for building objects.
	 */
	static Extend(
		base,
		name
	) {
		return {
			[name]: class extends base {
				constructor(...args) {
					super(...args);
					construct(this, ...args);
				}
			}
		}[name];
	}

	/**
	 * @param    {string}  name  Name for the abstract to have.
	 * @returns  {new *}  The abstract class..
	 */
	static Abstract(name) {
		const abstract = {
			[name]: class {
				constructor() {
					if (this.constructor === abstract)
						throw new AbstractError(name);
				}
			}
		}[name];
		return abstract;
	}
}

/**
 * @template T
 *
 * GEMify your existing types!
 * Adds some static properties for:
 *     + validation
 *     + parsing
 *     + serialising
 *     + type-checking
 *     + etc.
 *
 * @param    {T}  type
 * @returns  {T}  Modified class "type"
 */
export function Gemify(
	type
) {
	if (
		!is.class(type)
	)
		throw new ArgumentError(
			'type',
			Function,
			type.constructor
		);
	
	return Object.defineProperties(
		type,
		Properties.fixed(
			STATIC,
			false
		)
	);
}

/**
 * A factory for producing Meta-Types/Super-Classes (types of types)
 *
 * @function MetaType
 *
 * @param   {string}                meta_name
 * @param   {ConstructorFormatter}  constructor_format
 * @param   {object}                statics
 * 
 * @returns {TypeConstructor}  Type Constuctor --> a CLASS that constructs TYPES.
 */
export function MetaType(
	meta_name,
	constructor_format,
	statics = {}
) {
	if (!is.global(this))
		throw new MetaTypeError(meta_name);

	/** @type {TypeConstructor} */
	const TypeBuilder = {
		[meta_name]: function(
			name,
			...prescriptors
		) {
			// Restart TypeBuilder but use the
			// meta_name as the Type's name:

			if (
				!is.string(name)
			) {
				if (is.class(name))
					return TypeBuilder(
						meta_name,
						[name],
						...prescriptors
					);

				if (
					is.object_literal(name) || (
						is.array(name) && name.every(x => is.class(x))
					)
				)
					return TypeBuilder(
						meta_name,
						name,
						...prescriptors
					);
			}

			if (
				(
					!is.string(name) && is.array(name) &&
					name.every(x => is.class(x))
				) ||
				is.object_literal(name)
			) {
				return TypeBuilder(
					meta_name,
					name,
					...prescriptors
				);
			}

			const {
				parents,
				prescriptor,
				properties,
				prototype,
				defaults,
				listeners
			} = new ClassDescriptor(
				...prescriptors
			);

			const constructor =
				constructor_format(
					is.lamda(name) ?
						name({ parents, prescriptor }) :
						name,
					{
						parents,
						prescriptor,
						properties,
						prototype,
						defaults,
						listeners
					}
				);

			// TODO: REVISIT -- WHAT DID THIS SOLVE FOR US *EXACTLY*?
			// EXCEPT FOR THE STATICS, OF COURSE...
			Object.defineProperties(
				constructor,
				{
					...map(
						STATIC,
						to_descriptors
					),
					...map(
						statics,
						to_descriptors
					),
					...Properties.fixed(
						{
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
							// TODO: THIS IS PROBABLY WRONG
							listeners: {
								...constructor.listeners ?? {},
								...listeners
							},
							constructor: TypeBuilder,
						},
						false
					)
				}
			);

			Object.defineProperties(
				constructor.prototype,
				// Properties.fixed(
					map(
						prototype,
						to_descriptors
						// (key, method) => [
						// 	key,
						// 	is.object_literal(method) ?
						// 		Method(key, method) :
						// 		method
						// ]
					),
					// prototype,
					// false
				// )
			);

			return is.global(this) ?
				constructor :
				init(this, constructor);
		}
	}[meta_name];

	/** @type {TypeConstructor} */
	return Object.defineProperties(
		Gemify(TypeBuilder),
		Properties.fixed(
			{
				constructor: MetaType
			},
			false
		)
	);
}

/**
 * Generate a GENERIC Type. Creates a class that can
 * inherit multiple parents via *composition*.
 *
 * @example
 * class C extends Compose(A, B) {
 *     constructor() {
 *         super(
 *             ["args", "for", "class", "A"],
 *             ["other", "args", "for", "class", "B"]
 *         );
 *         // THE REST OF THE CODE GOES HERE...
 *     }
 * }
 * @type {TypeConstructor}
 */
export const Compose = MetaType(
	"Composition",
	name => Constructor.Class(name)
);

/**
 * Create an Abstract.  Not to be constructed directly but inherited by a
 * child class or defined/exported as a inheritable class.
 *
 * @example
 * export default Abstract(
 *     "IEventDispatcher",
 *     {
 *         listen(listener) {
 *             // ...
 *         },
 *         dispatch(msg) {
 *             // ...
 *         }
 *     }
 * );
 * @type {TypeConstructor}
 */
export const Abstract = MetaType(
	"Abstract",
	name => Constructor.Abstract(name)
);

/**
 * Create a basic Model type.  a Model Type, once made, can construct
 * instance with or without the NEW keyword.  The constructor, by default,
 * accepts objects to use as a collection of key-value pairs to assign to the
 * object instance.
 *
 * @example
 * const Student = Model(
 *     Person,
 *     Customer,
 *     {
 *         date_enrolled: Date,
 *         classes: Array,
 *         gpa: Number
 *     }
 * );
 *
 * const student = Student({
 *     name: "John Doe",
 *     customer_id: "x7B42AB00C8",
 *     date_enrolled: "2019-09-14", // <- will be parsed by Date
 *     gpa: 3.2
 * });
 * @type {TypeConstructor}
 */
export const Model = MetaType(
	"Model",
	name => Constructor.Object(name)
);

/**
 * Generate a Class Type. Directly extends the first parent
 * and then inherits through composition from the rest.
 *
 * @example
 * class C extends Source(
 *     SuperClassA, // <-- inherits DIRECTLY from this class
 *     SuperClassB, // <-- others types to extend.
 *     {
 *         property: 42,
 *         value: Boolean
 *     }
 * ) {
 *     constructor() {
 *         super(...arguments_to_pass_to_A);
 *         this.inherit(SuperClassB, ...args_to_pass_to_b);
 *     }
 *     // ...rest of code here
 * }
 * @type {TypeConstructor}
 */
export const Source = MetaType(
	"Class",
	(name, { parents: [base] }) => {
		return Constructor.Extend(
			base,
			name
		);
	}
);

/**
 * Create an Interface to be used for real-time data validation.
 *
 * @example
 * const Person = Interface({
 *     "name*": String,
 *     "age*": Number,
 *     "address?": String
 * });
 *
 * { name: "Jack", age: 32 } instanceof Person // -> TRUE
 * @type {TypeConstructor}
 */
export const Interface = MetaType(
	"Interface",
	name => Constructor.Abstract(name),
	{
		defines(object) {
			return Object.entries(
				this.prescriptor ?? {}
			).every(
				([key, descriptor]) => {
					if (!descriptor.is_required)
						return true;

					const value = object[key];
					return is.defined(value) && value instanceof descriptor.type;
				}
			);
		}
	}
);

export class Void extends Abstract {
	static defines(instance) {
		return is.undefined(instance);
	}
}

export class Any extends Abstract {
	static defines() {
		return true;
	}
}

export const List = MetaType(
	'<T>[]',
	(
		_,
		{ parents: [{ name }] }
	) => Constructor.Abstract(
		`${ name }[]`
	),
	{
		defines(instance) {
			const { parents: [T] } = this;
			return instance?.every?.(
				item => item instanceof T
			) ?? false;
		}
	}
);

export const Either = MetaType(
	'T|U|...|V',
	(
		_,
		{
			parents
		}
	) => Constructor.Abstract(
		`${
			parents.map(
				p => p.name
			).join('|')
		}`
	),
	{
		defines(instance) {
			const { parents } = this;
			return parents?.some?.(
				p => instance instanceof p
			);
		}
	}
);

export const Tuple = MetaType(
	`[...T]`,
	(
		_,
		{ parents }
	) => Constructor.Abstract(
		`[${ parents.map(p => p.name).join(',') }]`
	),
	{
		defines(instance) {
			const { parents } = this;
			return is.array(instance) &&
				parents.length === instance.length &&
					instance.every(
						(v, i) => v instanceof p[i]
					);
		}
	}
);

export const Options = (
	...values
) => {
	const name = `[${ values.map(v => tagify(v)).join('|') }]`;
	return {
		[name]: class extends Abstract {
			static defines(instance) {
				return values.includes(instance);
			}
		}
	}[name]
};

export const Scalar = MetaType();

export const Vector = MetaType();

bootstrap.forEach(
	([type, statics = {}]) =>
		Gemify(type).static(statics)
);

