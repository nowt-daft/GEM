import Int from "./int.js";

export default class UInt extends Int {
	static expression = /^[0-9]+$/;

	constructor(...args) {
		super(...args);
	}

	static defines(instance) {
		return Number.isInteger(instance) && instance > -1;
	}
}