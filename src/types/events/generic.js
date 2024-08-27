export default class GenericEvent extends Event {
	/**
	 * @param {string}  name
	 * @param {object}  data
	 * @param {boolean} bubbles
	 * @param {boolean} cancelable
	 */
	constructor(
		name,
		data = {},
		bubbles = false,
		cancelable = true
	) {
		super(name, { bubbles, cancelable });
		Object.assign(this, data);
	}
}

