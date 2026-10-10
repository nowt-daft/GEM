import { DelayedDescriptor } from "./accessor.js";

export default class Var extends DelayedDescriptor {
	constructor(
		Type,
		parse = Type.parse,
		stringify = Type.stringify
	) {
		super(
			Type,
			({ target, key }) => {
				const value = target.var(key);
				return (
					value ?
						parse.call(
							Type,
							value
						) :
						this._value
				);
			},
			({ target, key, to }) => {
				target.var(
					key,
					stringify.call(Type, to)
				);
				return to;
			},
			({ target, key, to, from }) => {
				target.dispatch(
					`var.${ key }`,
					{ to, from },
					false
				);
			}
		);
		this.required;
	}
}
