import { map } from '../types/object.js';
import Descriptor from './descriptor.js';
import { FixedProperty, VariableProperty } from './property.js';

export default class Properties {
	/**
	 * @param {object}  properties  A dictionary of Key-Value pairs
	 * @param {boolean} enumerable
	 * @param {FixedProperty|VariableProperty} descriptor
	 */
	constructor(
		properties,
		enumerable,
		descriptor
	) {
		Object.assign(
			this,
			map(
				properties,
				(key, value) => [
					key,
					value instanceof Descriptor ?
						value :
						new descriptor(
							value,
							enumerable
						)
				]
			)
		);
	}

	/**
	 * @param    {object}  properties  A dictionary of Key-Value pairs
	 * @param    {boolean} enumerable
	 *
	 * @returns  {Properties}  An object of Property Descriptors
	 */
	static fixed(
		properties,
		enumerable
	) {
		return new Properties(
			properties,
			enumerable,
			FixedProperty
		);
	}

	/**
	 * @param    {object}  properties  A dictionary of Key-Value pairs
	 * @param    {boolean} enumerable
	 *
	 * @returns  {Properties}  An object of Property Descriptors
	 */
	static variable(
		properties,
		enumerable
	) {
		return new Properties(
			properties,
			enumerable,
			VariableProperty
		);
	}
}
