import Descriptor from "./descriptor.js";

/**
 * @property  {boolean}  writable
 * @property  {any}      value
 */
export default class Property extends Descriptor {
	writable = false;
	value = undefined;

	/**
	 * @param {any} value The value the property has
	 * @param {boolean} writable
	 * @param {boolean} enumerable
	 * @param {boolean} [configurable=true]
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
	 * @param   {any} value
	 * @param   {boolean} enumerable
	 * @param   {boolean} [configurable=true]
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
	 * @param   {any} value
	 * @param   {boolean} enumerable
	 * @param   {boolean} [configurable=true]
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

export class FixedProperty extends Property {
	/**
	 * @param {any} value
	 * @param {boolean} enumerable
	 * @param {boolean} [configurable=true]
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

export class VariableProperty extends Property {
	/**
	 * @param {any} value
	 * @param {boolean} enumerable
	 * @param {boolean} [configurable=true]
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
