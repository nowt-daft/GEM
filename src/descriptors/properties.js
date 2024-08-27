import { map } from '../types/object.js';
import Descriptor from './descriptor.js';
import { FixedProperty, VariableProperty } from './property.js';

/**
 * @typedef {string|symbol} Key
 */
/**
 * @typedef {Record<Key,any>} Dictionary
 */
/**
 * @typedef {FixedProperty|VariableProperty} Property
 */
/**
 * @typedef {Record<Key,Property>} PropertyDescriptors
 */

export default class Properties {
	/**
	 * @param   {Dictionary}       properties  A dictionary of Key-Value pairs
	 * @param   {boolean}          enumerable
	 * @param   {new => Property}  descriptor
	 * @returns {PropertyDescriptors}  A dictionary of property descriptors
	 */
	static create(
		properties,
		enumerable,
		descriptor
	) {
		return map(
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
		);
	}

	/**
	 * @param    {Dictionary}  properties  A dictionary of Key-Value pairs
	 * @param    {boolean}     enumerable
	 * @returns  {PropertyDescriptors}  An object of Property Descriptors
	 */
	static fixed(
		properties,
		enumerable
	) {
		return Properties.create(
			properties,
			enumerable,
			FixedProperty
		);
	}

	/**
	 * @param    {Dictionary}  properties  A dictionary of Key-Value pairs
	 * @param    {boolean}     enumerable
	 * @returns  {PropertyDescriptors}  An object of Property Descriptors
	 */
	static variable(
		properties,
		enumerable
	) {
		return Properties.create(
			properties,
			enumerable,
			VariableProperty
		);
	}
}
