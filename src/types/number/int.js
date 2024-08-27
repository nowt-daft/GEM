import ParseError from "../../errors/parse.js";

export default class Int extends Number {
	static expression = /^(\+|-)?[0-9]+$/;
	static defines(num) {
		return Number.isInteger(num);
	}
	static parse(string) {
		const int = parseInt(string);
		if (Number.isNaN(int))
			throw new ParseError(Int, string);
		return int;
	}
	constructor(...args) {
		super(...args);
	}
}
