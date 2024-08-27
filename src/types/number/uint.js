import Int from "./int.js";

export default class UInt extends Int {
	static expression = /^[0-9]+$/;

	static defines(num) {
		return Number.isInteger(num) && num > 0;
	}
}
