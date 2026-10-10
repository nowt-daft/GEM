export default class Int extends Number {
	static expression = /^(\+|-)?[0-9]+$/;

	constructor(...args) {
		super(...args);
	}

	static defines(instance) {
		return Number.isInteger(instance);
	}

	static parse(string) {
		const int = parseInt(string);
		if (int === NaN)
			throw `!${this.name.toUpperCase()} PARSE ERROR! "${string}" is not an ${this.name}.`;
		return int;
	}
}