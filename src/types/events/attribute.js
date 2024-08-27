import StateChangeEvent from "./state-change.js";

/**
 * @template T
 * @class    AttributeEvent
 * @extends  StateChangeEvent<T>
 */
export default class AttributeEvent extends StateChangeEvent {
	static NAME = "attr";

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
			AttributeEvent.NAME,
			key,
			type,
			from,
			to
		);
	}
}
