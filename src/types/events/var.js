import StateChangeEvent from "./state-change.js";

/**
 * @template T
 * @class    AttributeEvent
 * @extends  StateChangeEvent<T>
 */
export default class VarEvent extends StateChangeEvent {
	static NAME = "var";

	/**
	 * @param {string}      key
	 * @param {new => T}    type
	 * @param {T}           from
	 * @param {T}           to
	 */
	constructor(
		key,
		type,
		from,
		to
	) {
		super(
			VarEvent.NAME,
			key,
			type,
			from,
			to
		);
	}
}
