import { MetaDescriptor } from "./accessor.js";

export default class Attribute extends MetaDescriptor {
	constructor(
		Type,
		onchange
	) {
		super(
			Type,
			({ target, key }) => {
				const value = target.attr(key);
				return (
					value ?
						Type.parse(value) :
						this._value
				);
			},
			({ target, key, to }) => {
				target.attr(key, Type.stringify(to));
				return to;
			},
			({ target, key, to, from }) => {
				onchange({ target, key, to, from });
				target.dispatch(
					`attr.${ key }`,
					{ to, from },
					false
				);
			}
		)
	}
}
