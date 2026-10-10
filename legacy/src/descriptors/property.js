import Descriptor from "./descriptor.js";

export default class Property extends Descriptor {
	value = undefined;

	constructor(
		value,
		enumerable = false,
		writable = false,
		configurable = true
	) {
		super(
			enumerable,
			writable,
			configurable
		);
		this.value = value;
	}

	static static(
		value,
		enumerable = false,
		configurable = true
	) {
		return new Property(
			value,
			enumerable,
			false,
			configurable
		);
	}

	static variable(
		value,
		enumerable = false,
		configurable = true
	) {
		return new Property(
			value,
			enumerable,
			true,
			configurable
		);
	}
}