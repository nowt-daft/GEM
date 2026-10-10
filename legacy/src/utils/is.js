import {
	log as print
} from 'console';

export const TYPES = [
	(() => undefined),	// function
	"",					// string
	true,				// boolean
	0,					// number
	null,				// object
	Symbol(),			// symbol
	0n,					// bigint
	undefined			// undefined
].map(
	value => typeof value
);

export default {
	...Object.fromEntries(
		TYPES.map(
			type => [
				type,
				value => typeof value === type
			]
		)
	),
	defined(value) {
		return (
			!this.undefined(value) &&
			value !== null
		);
	},
	either(a, b) {
		return this.defined(a) ? a : b;
	},
	literal(value) {
		return !(
			this.object(value) ||
			this.function(value)
		);
	},
	raw_object(value) {
		return value?.constructor === Object;
	},
	method(value) {
		return (
			this.function(value) &&
			this.undefined(value.prototype)
		);
	},
	constructable(type) {
		return Boolean(
			this.function(type) &&
			type.prototype &&
			type.name
		);
	},
	class(type) {
		return (
			this.constructable(type) &&
			!Object.hasOwn(
				type,
				'caller'
			)
		);
	},
	global(that) {
		return (
			this.undefined(that) ||
			that === globalThis
		);
	}
}
