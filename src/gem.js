import is from "./utils/is.js";
import { init, construct } from "./types/object.js";

import Properties from "./descriptors/properties.js";
import ClassDescriptor from "./descriptors/class.js";

import MetaTypeError from "./errors/metatype.js";
import AbstractError from "./errors/abstract.js";

export { default as Field } from "./descriptors/field.js";

import bootstrap from "./misc/bootstrap.js";

/**
 * @mixin
 */
export const STATIC = {
	expression: /.*/i,
	/**
	 * @param    {string}  string
	 * @returns  {boolean}
	 */
	validate(string) {
		return this.expression.test(string);
	},
	/**
	 * @param    {string}  string
	 * @returns  {object}  Constructed instance of type based-on string
	 */
	parse(string) {
		return new this(string);
	},
	/**
	 * @param    {object}  instance
	 * @returns  {string}  string representation of the instance
	 */
	stringify(instance) {
		return `${ instance }`;
	},

	/**
	 * How do we serialise the instance into JSON? By default,
	 * We leave it untouched.
	 *
	 * @param   {object}  instance
	 * @returns {any}
	 */
	serialise(instance) {
		return instance;
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
		return Object.defineProperties(
			this,
			Properties.fixed(
				properties,
				enumerable
			)
		);
	},

	/**
	 * @param    {any}     value
	 * @returns  {boolean} Is the value an instance or descendent of this class?
	 */
	defines(value) {
		return is.of_type(value, this);
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
	}
}

/**
 * @callback ConstructorFormatter
 * @param    {string}  name  Name of the class/type.
 * @param    {ClassDescriptor}  descriptor  Info about type (parents, properties, etc.)
 * @returns  {class}  Factory that builds types/constructors/classes.
 */

/**
 * @callback Name
 * @param    {object}  descriptor
 * @param    {class[]} descriptor.parents
 * @param    {object}  descriptor.prescriptor
 * @returns  {string}  name to assign
 */

/**
 * If name is absent, there must be at least TWO parents; OR, at least ONE
 * parent and ONE definition; OR, ONE definition.
 *
 * If parents are absent, there must be ONE definition. Name is optional.
 *
 * If definition is absent, there must be at least TWO parents.
 *
 * @callback TypeConstructor
 * @param    {string|Name}    name  Name for the Type/Class to have
 * @param    {...new object}  parents  Any parent types to extend/inherit.
 * @param    {object}         definition  Properties, methods, listeners, etc.
 * @returns  {class}          A constructor/class.
 */

class Constructor {
	/**
	 * @param    {string}  name  Name for the object constructor.
	 * @returns  {class}   Constructor for building objects.
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
	 * @returns  {class}   Class for building objects.
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
	 * @param    {class}   base   Base class to directly extend.
	 * @param    {string}  name   Name for the child class to have.
	 * @returns  {class}  Class for building objects.
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
	 * @returns  {class}  The abstract class..
	 */
	static Abstract(name) {
		const abstract = {
			[name]: class Abstract {
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
 * A factory for producing MetaTypes (types of types)
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
			// TYPIFY class
			if (
				is.global(this) &&
				prescriptors.length === 0 &&
				is.class(name)
			) {
				return Object.defineProperties(
					name,
					Properties.fixed(STATIC, false)
				);
			}

			// Restart Type but using the meta_name as the Type's name...
			if (
				is.class(name) ||
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
					is.lamda(name) ? name({ parents, prescriptor }) : name,
					{
						parents,
						prescriptor,
						properties,
						prototype,
						defaults,
						listeners
					}
				);

			Object.defineProperties(
				constructor,
				Properties.fixed(
					{
						...STATIC,
						...statics,
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
						},
						constructor: TypeBuilder,
					},
					false
				)
			);

			Object.defineProperties(
				constructor.prototype,
				Properties.fixed(
					prototype,
					false
				)
			);

			return is.global(this) ? constructor : init(this, constructor);
		}
	}[meta_name];

	/** @type {TypeConstructor} */
	return Object.defineProperties(
		TypeBuilder(TypeBuilder), // Typify ourselves!
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
 * inherit multiple parents.
 *
 * @example
 * class C extends Type(
 *   A, B, // <-- parents
 *   {
 *     property: 42,
 *     value: Boolean
 *   }
 * ) {
 *   // ...rest of code here
 * }
 *
 * @callback GenericType
 *
 * @param    {...new object}  parents
 * @param    {object}         definition
 * @returns  {class}          Newly constructed class/type.
 */
/** @type {GenericType} */
export const Compose = MetaType(
	"Composition",
	name => Constructor.Class(name)
);

/**
 * Create an Abstract.  Not to be constructed directly but inherited by a
 * child class.
 *
 * @example
 * export default Abstract(
 *   "IEventDispatcher",
 *   {
 *     listen(listener) {
 *       // ...
 *     },
 *     dispatch(msg) {
 *       // ...
 *     }
 *   }
 * );
 *
 * @callback AbstractType
 *
 * @param    {string}  name
 * @param    {object}  definition
 * @returns  {class}   The abstract.
 */
/** @type {AbstractType} */
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
 *   Person,
 *   Customer,
 *   {
 *     date_enrolled: Date,
 *     classes: Array,
 *     gpa: Number
 *   }
 * );
 *
 * const student = Student({
 *   name: "John Doe",
 *   customer_id: "x7B42AB00C8",
 *   date_enrolled: "2019-09-14", // <- will be parsed by Date
 *   gpa: 3.2
 * });
 *
 * @callback ModelType
 *
 * @param    {...new object} [parents]
 * @param    {object}        definition
 * @returns  {class}  Newly constructed class/type.
 */
/** @type {ModelType} */
export const Model = MetaType(
	"Model",
	name => Constructor.Object(name)
);

/**
 * Generate a Source Type. Directly extends the first parent
 * and then inherits from the rest.
 *
 * @example
 * class C extends Source(
 *   A, B, // <-- parents
 *   {
 *     property: 42,
 *     value: Boolean
 *   }
 * ) {
 *   constructor() {
 *     super(arguments_to_pass_to_A);
 *   }
 *   // ...rest of code here
 * }
 *
 * @callback SourceType
 *
 * @param    {...new object} parents
 * @param    {object}        definition
 * @returns  {class}  Newly constructed class/type.
 */
/** @type {SourceType} */
export const Source = MetaType(
	"Source",
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
 *   "name*": String,
 *   "age*": Number,
 *   "address?": String
 * });
 *
 * { name: "Jack", age: 32 } instanceof Person // -> TRUE
 *
 * @callback InterfaceType
 *
 * @param    {object}  definition
 * @returns  {class} Newly constructed class/type.
 */
/** @type {InterfaceType} */
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

bootstrap.forEach(
	([type, statics = {}]) =>
		Compose(type).static(statics)
);

