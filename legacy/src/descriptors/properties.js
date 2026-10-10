import '../utils/object.js';
import Property from './property.js';

export default class Properties {
	constructor(
		properties = {},
		enumerable = false,
		configurable = true,
		descriptor = Property.static
	) {
		Object.assign(
			this,
			Object.map(
				properties,
				(
					key,
					value
				) => [
					key,
					descriptor(
						value,
						enumerable,
						configurable
					)
				]
			)
		);
	}

	static static(
		properties = {},
		enumerable = true,
		configurable = true,
	) {
		return new Properties(
			properties,
			enumerable,
			configurable,
			Property.static
		);
	}

	static variable(
		properties = {},
		enumerable = true,
		configurable = true
	) {
		return new Properties(
			properties,
			enumerable,
			configurable,
			Property.variable
		);
	}
}