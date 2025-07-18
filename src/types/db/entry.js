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
	 * @param    {object}  data  Data to update on the Entry.
	 * @returns  {Entry}   this
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

	/**
	 * This method allows Entries to be SOFT COMPARED.
	 *
	 * @example
	 * console.log(entryA == otherEntry);
	 * // TRUE if their IDs match and belong to the same "table"/schema
	 * 
	 * console.log(+entry);
	 * // This will print the entry's ID.
	 *
	 * console.log(`${ entry }`);
	 * // => "User[43]"
	 *
	 * @returns  {string}
	 */
	valueOf() {
		return `${ this.constructor.name }[${ this.id }]`;
	}
}
