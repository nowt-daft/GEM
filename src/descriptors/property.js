import Descriptor from "./descriptor.js";

/**
 * @template T
 */
export default class Property extends Descriptor {
	/** @type {boolean} */
	writable = false;
	/** @type {T} */
	value = undefined;

	/**
	 * @param  {T}        value  The value the property has
	 * @param  {boolean}  writable
	 * @param  {boolean}  enumerable
	 * @param  {boolean}  configurable
	 */ 
	constructor(
		value,
		writable,
		enumerable,
		configurable = true
	) {
		super(
			enumerable,
			configurable
		);
		Object.assign(
			this,
			{
				writable,
				value
			}
		);
	}
	
	/**
	 * @param   {T}        value
	 * @param   {boolean}  enumerable
	 * @param   {boolean}  configurable
	 *
	 * @returns {FixedProperty} Property whose value CANNOT be changed.
	 */
	static fixed(
		value,
		enumerable,
		configurable = true
	) {
		return new FixedProperty(
			value,
			enumerable,
			configurable
		);
	}

	/**
	 * @param   {T}        value
	 * @param   {boolean}  enumerable
	 * @param   {boolean}  configurable
	 *
	 * @returns {VariableProperty} Property whose value is rewritable.
	 */
	static variable(
		value,
		enumerable,
		configurable = true
	) {
		return new VariableProperty(
			value,
			enumerable,
			configurable
		);
	}
}

/**
 * @template T
 * @extends Property<T>
 */
export class FixedProperty extends Property {
	/**
	 * @param  {T}        value
	 * @param  {boolean}  enumerable
	 * @param  {boolean}  configurable
	 *
	 */
	constructor(
		value,
		enumerable,
		configurable = true
	) {
		super(
			value,
			false,
			enumerable,
			configurable
		);
	}
}

/**
 * @template T
 * @extends Property<T>
 */
export class VariableProperty extends Property {
	/**
	 * @param  {T}        value
	 * @param  {boolean}  enumerable
	 * @param  {boolean}  configurable
	 */
	constructor(
		value,
		enumerable,
		configurable = true
	) {
		super(
			value,
			true,
			enumerable,
			configurable
		);
	}
}
