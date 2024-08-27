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
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if function. False otherwise.
	 */
	function(value) {
		return typeof value === FUNCTION;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if string. False otherwise.
	 */
	string(value) {
		return typeof value === STRING;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if boolean. False otherwise.
	 */
	boolean(value) {
		return typeof value === BOOLEAN;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if number. False otherwise.
	 */
	number(value) {
		return typeof value === NUMBER;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if symbol. False otherwise.
	 */
	symbol(value) {
		return typeof value === SYMBOL;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if bigint. False otherwise.
	 */
	bigint(value) {
		return typeof value === BIGINT;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if undefined. If null, returns false.
	 */
	undefined(value) {
		return typeof value === UNDEFINED;
	}
	/**
	 * @param    {any}      value
	 * @returns  {boolean}  True if null. If undefined, returns false.
	 */
	null(value) {
		return value === null;
	}
	/**
	 * @param    {any}      value
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
	 * @param    {any}      value
	 * @returns  {boolean}  Returns true if NOT undefined AND NOT null.
	 */
	defined(value) {
		return (
			!this.undefined(value) &&
			value !== null
		);
	}

	/**
	 * @param    {any}      num
	 * @returns  {boolean}  Returns true if argument is an integer.
	 */
	integer(num) {
		return Number.isInteger(num);
	}

	/**
	 * @param    {any}      value
	 * @returns  {boolean}  Value must not be an object nor a function.
	 */
	literal(value) {
		return (
			!this.object(value) &&
			!this.function(value)
		);
	}
	/**
	 * @param    {any}      obj
	 * @returns  {boolean}  Does the argument descend DIRECTLY from Object?
	 */
	object_literal(obj) {
		return obj?.constructor === Object;
	}

	/**
	 * @param    {any}      rry
	 * @returns  {boolean}  Argument must descend from Array.
	 */
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
	 * @param    {function} func
	 * @returns  {boolean}  Returns true if function uses the "function" keyword.
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
	 * @param    {function} func
	 * @returns  {boolean}  Returns true if function is an arrow function.
	 */
	lamda(func) {
		const source = func?.toString();
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
	 * @returns  {function} func
	 * @returns  {boolean}  Returns true if function exists on an Object as a method.
	 */
	method(func) {
		return (
			this.function(func) &&
			this.object_literal(func.params) || (
				this.undefined(func.prototype) &&
				func.name !== "" &&
				func.toString().startsWith(func.name)
			)
		);
	}
	/**
	 * @param    {class|function} type
	 * @returns  {boolean}  Type can be a function or a class.
	 */
	constructable(type) {
		return (
			this.function(type) &&
			// TODO: prototype should also be NON-EMPTY
			this.defined(type.prototype) &&
			type.name.length > 0
		);
	}
	/**
	 * @param    {class}    type
	 * @returns  {boolean}  Type is a class and not just a function.
	 */
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
	 * @param    {function}  type1
	 * @param    {function}  type2
	 * @returns  {boolean}   Is type1 the same as type2 or a child of type2
	 */
	type(type1, type2) {
		return this.defined(type1) && this.defined(type2) && (
			type1 === type2 ||
			(
				type1?.parents?.length ?
					type1
						.parents
						.some(
							parent => this.type(parent, type2)
						) :
					type1?.__proto__ !== Object.__proto__ ?
						this.type(type1.__proto__, type2) : // Does type1 extend type2?
						type2 === Object // End of the chain... is type2 Object?
			)
		);
	}
	/**
	 * @param    {any}       value  Value to check
	 * @param    {function}  type   Expected type of value
	 * @returns  {boolean}   Is value of type?
	 */
	of_type(value, type) {
		return this.type(value.constructor, type);
	}
	/**
	 * @param    {any}     that
	 * @returns  {boolean} Is argument the global object (eg. window)
	 */
	global(that) {
		return (
			!this.defined(that) ||
			that === globalThis
		);
	}
}
