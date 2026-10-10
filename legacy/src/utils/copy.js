import './object.js';

export default function copy(value) {
	return (
			value === null ||
			typeof value !== 'object'
		) ?
			value :
			value instanceof Array ?
				value.map(copy) :
				Object.map(
					value,
					(key, value) => [
						key,
						copy(value)
					]
				);
}
