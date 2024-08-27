import GenericEvent from "./generic.js";

/**
 * @template T
 */
export default class StateChangeEvent extends GenericEvent {
	/** @type {string} */
	key;

	/** @type {T} */
	from;
	/** @type {T} */
	to;

	/** @type {new => T} */
	class;

	/**
	 * @param {string}      name
	 * @param {HTMLElement} target
	 * @param {string}      key
	 * @param {new => T}    type
	 * @param {T}           from
	 * @param {T}           to
	 */
	constructor(
		name,
		key,
		type,
		from,
		to
	) {
		super(
			`${ name }:${ key }`,
			{ key, class: type, from, to }
		);
	}
}

