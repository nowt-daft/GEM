import Accessor from "./descriptors/accessor.js";
import Getter from "./descriptors/getter.js";
import { Model } from "./gem.js";

export default class Thing extends Model(
	{
		poop: Number,
		_state: String,
		_is_thingied: Boolean,
		property: 42,
		value: Accessor.Get(() => 'some_value'),
		other_val: Getter(Date, () => new Date),
		older_method(text = '') {
			return text;
		}
	}
) {
	get val() {
		return "THIS IS A VALUE";
	}
	constructor() {
		super();
	}

	some_method(num = 12) {
		this.property = num;
	}
}
