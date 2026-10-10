export default class Descriptor {
	enumerable = Boolean();
	writable = Boolean();
	configurable = Boolean();

	constructor(
		enumerable = false,
		writable = false,
		configurable = true
	) {
		Object.assign(
			this,
			{
				enumerable,
				writable,
				configurable
			}
		);
	}
}
