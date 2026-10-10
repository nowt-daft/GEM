import { log as print } from 'console';

import '../utils/object.js';
import is from '../utils/is.js';

import Descriptor from './descriptor.js';
import Accessor, { MetaDescriptor } from './accessor.js';

export default class Fields {
	constructor(
		properties = {}
	) {
		Object.assign(
			this,
			Object.map(
				properties,
				(key, value) => {
					const field = (
						value instanceof Descriptor ?
							value :
							value instanceof MetaDescriptor ?
								value :
								is.constructable(value) ?
									Accessor.Field(value) :
									Accessor
										.Field(
											value?.constructor
										)
										.assign(value)
					);

					return [
						field.parse?.(key) ?? key,
						field
					];
				}
			)
		);
	}

	init() {
		return Object.map(
			this,
			(key, field) => [
				key,
				field.init?.(key) ?? field
			]
		);
	}
}