/**
 * @property  {boolean}  enumerable
 * @property  {boolean}  configurable
 */
export default class Descriptor {
	enumerable = false;
	configurable = true;

	/**
	 * @param {boolean} enumerable Is the property visibile when iterating over object?
	 * @param {boolean} [configurable=true] Can we reconfigure the property?
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

