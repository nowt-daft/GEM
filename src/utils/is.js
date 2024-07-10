const FUNCTION	= typeof (() => {});
const STRING	= typeof "";
const BOOLEAN	= typeof true;
const NUMBER	= typeof 0;
const OBJECT	= typeof null;
const SYMBOL	= typeof Symbol();
const BIGINT	= typeof 0n;
const UNDEFINED = typeof undefined;

const CLASS = 'class';
const TYPE = 'Type'; // CIRCULAR: GEM will implement. Must be a String.

class TypeOf {
	function(value) {
		return typeof value === FUNCTION;
	}
	string(value) {
		return typeof value === STRING;
	}
	boolean(value) {
		return typeof value === BOOLEAN;
	}
	number(value) {
		return typeof value === NUMBER;
	}
	symbol(value) {
		return typeof value === SYMBOL;
	}
	bigint(value) {
		return typeof value === BIGINT;
	}
	/**
	 * @returns  {boolean}  True if undefined. If null, returns false.
	 */
	undefined(value) {
		return typeof value === UNDEFINED;
	}
	/**
	 * @returns  {boolean}  True if null. If undefined, returns false.
	 */
	null(value) {
		return value === null;
	}
	/**
	 * @returns  {boolean}  Anything that inherits from Object that is not null.
	 */
	object(value) {
		return (
			typeof value === OBJECT &&
			!this.null(value)
		);
	}
}

export default new class is extends TypeOf {
	constructor() {
		super();
	}
	
	/**
	 * @returns  {boolean}  Returns true if NOT undefined AND NOT null.
	 */
	defined(value) {
		return (
			!this.undefined(value) &&
			value !== null
		);
	}

	integer(num) {
		return Number.isInteger(num);
	}

	literal(value) {
		return (
			!this.object(value) &&
			!this.function(value)
		);
	}
	object_literal(obj) {
		return obj?.constructor === Object;
	}

	array(rry) {
		return rry instanceof Array;
	}

	// TODO: Must implement ASYNC function testing...

	/**
	 * @example
	 * function example(param) {
	 *     // source code here...
	 * }
	 *
	 * @returns  {boolean} Returns true if uses function keyword.
	 */
	function_literal(func) {
		return (
			this.function(func) &&
			this.defined(func.prototype) &&
			func.toString().startsWith(FUNCTION)
		);
	}
	/**
	 * @example
	 * const example = x => x ** x;
	 *
	 * @returns  {boolean} Returns true if arrow function.
	 */
	lamda(func) {
		const source = func.toString();
		return (
			this.function(func) &&
			this.undefined(func.prototype) &&
			(func.name === "" || !source.startsWith(func.name)) &&
			!source.startsWith(FUNCTION)
		);
	}
	/**
	 * @example
	 * const object = {
	 *     some_method() {
	 *       // method source code here...
	 *     }
	 * };
	 *
	 * @returns  {boolean} Returns true if function exists on an Object.
	 */
	method(func) {
		return (
			this.function(func) &&
			this.undefined(func.prototype) &&
			func.name !== "" &&
			func.toString().startsWith(func.name)
		);
	}
	constructable(type) {
		return (
			this.function(type) &&
			// TODO: prototype should also be NON-EMPTY
			this.defined(type.prototype) &&
			type.name.length > 0
		);
	}
	class(type) {
		return (
			this.constructable(type) &&
			(
				// TODO: optimise...
				type.toString().startsWith(CLASS) ||
				type.constructor.name === TYPE ||
				type.toString().startsWith(FUNCTION)
			)
		);
	}
	/**
	 * Check if type1 is the same type or a derivative type of type2.  In other
	 * words, is type2 the same or a parent type of type1.
	 *
	 * @param   {function}   type1
	 * @param   {function}   type2
	 * @returns {boolean} Is type1 the same as type2 or a child of type2
	 */
	type(type1, type2) {
		return this.defined(type1) && this.defined(type2) && (
			type1 === type2 ||
			(
				type1?.parents?.length ? // Is a GEM type?
					type1 // Are some of type1's parents the same as type2?
						.parents
						.some(
							parent => this.type(parent, type2)
						) :
					// Otherwise, check the __proto__ chain...
					type1?.__proto__ !== Object.__proto__ ?
						this.type(type1.__proto__, type2) : // Does type1 extend type2?
						type2 === Object // End of the chain... is type2 Object?
			)
		);
	}
	/**
	 * @param    {any}   value  Value to check
	 * @param    {function} type   Expected type of value
	 * @returns  {boolean}  Is value of type?
	 */
	of_type(value, type) {
		return this.type(value.constructor, type);
	}
	global(that) {
		return (
			!this.defined(that) ||
			that === globalThis
		);
	}
}
