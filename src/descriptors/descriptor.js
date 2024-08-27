export default class Descriptor {
	/** @type {boolean} */
	enumerable = false;
	/** @type {boolean} */
	configurable = true;

	/**
	 * @param {boolean} enumerable    Is property visibile when iterating?
	 * @param {boolean} configurable  Can we reconfigure the property?
	 */
	constructor(
		enumerable,
		configurable = true
	) {
		Object.assign(
			this,
			{
				enumerable,
				configurable
			}
		);
	}
}

