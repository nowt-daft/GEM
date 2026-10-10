import UInt from "../../types/number/uint.js";
import { Model } from "../../zed.js";

export default class Entry extends Model({
	"id*": UInt,
	"date_created*": Date,
	"date_modified*": Date
}) {
	constructor(
		data = {}
	) {
		super({
			date_created: new Date,
			date_modified: new Date,
			...data
		});
	}

	update(
		data = {}
	) {
		return (
			Object.assign(
				this,
				data,
				{ date_modified: new Date }
			)
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
