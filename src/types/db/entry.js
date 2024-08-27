import UInt from "../number/uint.js";
import { Model } from "../../gem.js";

export default class Entry extends Model({
	"id*": UInt,
	"date_created*": Date,
	"date_modifed*": Date
}) {
	/**
	 * @param  {object}  data  Any object instance will do.
	 */
	constructor(data) {
		super({
			date_created: new Date,
			date_modifed: new Date,
			...data
		});
	}

	/**
	 * Like patch in a RESTful API. Pass the data you wish
	 * to change.
	 *
	 * @param  {object}  data  Data to update on the Entry.
	 */
	update(data) {
		return Object.assign(
			this,
			data,
			{ date_modifed: new Date }
		);
	}

	[Symbol.toPrimitive](hint) {
		if (hint === "number")
			return this.id;
		
		return this.valueOf();
	}

	valueOf() {
		return `${ this.constructor.name }[${ this.id }]`;
	}
}
