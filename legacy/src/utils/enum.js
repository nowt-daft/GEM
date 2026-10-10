export default class Enum extends Array {
	constructor(...keys) {
		super(...keys);
		Object.assign(
			this,
			Object.fromEntries(
				keys.map(
					key => [
						key,
						Symbol(key)
					]
				)
			)
		);
	}
}
