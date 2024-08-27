import { map } from "../types/object.js";
import is from "../utils/is.js";

import Descriptor from "./descriptor.js";
import MetaDescriptor from "./meta.js";
import { Field } from "./field.js";

/**
 * @typedef {string|symbol} Key
 */
/**
 * @typedef {Descriptor|MetaDescriptor} FieldDescriptor
 */
/**
 * @typedef {Record<Key,any>} Dictionary
 */
/**
 * @typedef {Record<Key,FieldDescriptor>} FieldDescriptors
 */
/**
 * @typedef {Record<Key,Descriptor>} Descriptors
 */

export default class Fields {
	/**
	 * @param    {Dictionary}  properties
	 * @returns  {FieldDescriptors}
	 */
	static create(properties) {
		return map(
			properties,
			(key, value) => {
				const field = (
					value instanceof Descriptor ?
						value :
						value instanceof MetaDescriptor ?
							value.parse(key) :
							is.class(value) ?
								Field.type(value).parse(key) :
								Field.from(value).parse(key)
				);
				return [
					field.key ?? key,
					field
				];
			}
		);
	}

	/**
	 * @param    {FieldDescriptors}  field_descriptors
	 * @returns  {Descriptors}
	 */
	static to_descriptors(
		field_descriptors
	) {
		return map(
			field_descriptors,
			(key, field) => [key, field.init?.() ?? field]
		);
	}
}
