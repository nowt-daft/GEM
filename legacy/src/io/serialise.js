const TAB = '\t';

export default class Serialise {
	static stringify(object = {}) {
		return JSON.stringify(
			object,
			(_, value) =>
				value?.constructor.serialise?.(value) ?? value,
			TAB
		);
	}

	static parse(string = '') {
		return string ? JSON.parse(string) : null;
	}
}