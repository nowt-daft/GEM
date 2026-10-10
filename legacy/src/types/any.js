import { Type } from '../zed.js'

export default class Any extends Type {
	constructor() {
		throw `Cannot construct instance of Any. It doesn't even make sense, bruh.`;
	}
	static defines() {
		return true;
	}
}
