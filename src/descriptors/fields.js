import { map } from "../types/object.js";
import is from "../utils/is.js";

import Descriptor from "./descriptor.js";
import MetaDescriptor from "./meta.js";
import { Field } from "./field.js";

export default class Fields {
	/**
	 * @param {object} properties
	 */
	constructor(properties) {
		Object.assign(
			this,
			map(
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
			)
		);
	}

	init() {
		return map(
			this,
			(key, field) => [key, field.init?.() ?? field]
		);
	}
}
