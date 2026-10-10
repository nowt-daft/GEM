import is from "../utils/is.js";
import tagify from '../utils/tagify.js';

import Descriptor from "./descriptor.js";
import Property from "./property.js";
import Properties from "./properties.js";

import delay from '../utils/delay.js';

import { Broadcaster } from "../utils/broadcaster.js";

const STAR = '*';
const EMPTY = '';
const MAYBE = '?';
const UNDERSCORE = '_';

const NULL = 'null';
const UNDEFINED = 'undefined';

class GetData {
	target;
	key;

	constructor(
		target,
		key
	) {
		Object.assign(
			this,
			{
				target,
				key
			}
		);
	}
}

class SetData {
	target;
	key;
	to;
	from;

	constructor(
		target,
		key,
		to,
		from
	) {
		Object.assign(
			this,
			{
				target,
				key,
				to,
				from
			}
		);
	}
}

export default class Accessor extends Descriptor {
	constructor(
		descriptor = {},
		enumerable = true,
		configurable = true,
	) {
		super(
			enumerable,
			undefined,
			configurable
		);
		delete this.writable;

		Object.assign(
			this,
			descriptor
		);
	}

	static Get(
		get = target => undefined,

		enumerable = true,
		configurable = true,
	) {
		return new Get(
			get,
			enumerable,
			configurable
		);
	}

	static GetSet(
		key,
		get = ({target, key}) => undefined,
		set = ({target, key, to, from}) => undefined,

		enumerable = true,
		configurable = true,
	) {
		return new GetSet(
			key,
			get,
			set,
			enumerable,
			configurable
		);
	}

	// Comeback to this...
	static Field(
		Type = Object,
		onchange = ({target, to, from}) => undefined
	) {
		return new Field(
			Type,
			onchange
		);
	}
}

export class Get extends Accessor {
	constructor (
		get = target => undefined,

		enumerable = true,
		configurable = true,
	) {
		super(
			{
				get() {
					return get(this);
				},
				set(value) {
					console.warn(`WARNING: ATTEMPT TO SET VALUE OF GETTER.`);
					return value;
				}
			},
			enumerable,
			configurable
		);
	}
}

export class GetSet extends Accessor {
	constructor(
		key,
		get = ({target, key}) => undefined,
		set = ({target, key, to, from}) => undefined,

		enumerable = true,
		configurable = true,
	) {
		const hidden_key = Symbol(`${ key }`);
		super(
			{
				get() {
					return (
						this[hidden_key] ??
						(
							Object.defineProperty(
								this,
								hidden_key,
								Property.variable(
									get(
										new GetData(
											this,
											key
										)
									)
								)
							) &&
							this[hidden_key]
						)
					);
				},
				set(to) {
					const from = this[key];
					return (
						from === to ?
							from :
							(
								this[hidden_key] =
									set(
										new SetData(
											this,
											key,
											to,
											from
										)
									)
							)
					);
				}
			},
			enumerable,
			configurable
		);
	}
}

export class TypedAccessor extends GetSet {
	constructor(
		key,
		Type,

		value,
		nullable,
		required,

		get = ({ target, key }) => new Type,
		set = ({ target, key, to, from }) => new Type,

		onchange = ({ target, key, to, from }) => undefined,

		enumerable = true,
		configurable = true,
	) {
		super(
			key,
			({ target, key }) => {
				if (!is.constructable(Type))
					Type = Type();

				return value ?? get({ type: Type, target, key });
			},
			({ target, key, to, from }) => {
				if (
					to instanceof Type ||
					(
						nullable &&
						to === null
					)
				) {
					const data = {
						type: Type,
						target,
						key,
						to: (
							is.string(to) &&
							Type !== String && // What about children of String?
							Type.parse
						) ?
							Type.parse(to) :
							to,
						from
					};

					delay(
						() => onchange(data)
					);
					
					return set(data);
				}
				
				throw new TypeError(
					`ASSIGNMENT ERROR: ${
						target.constructor.name
					} @ ${
						key
					}:${
						Type.name ?? 'Any'
					}${
						required ?
							STAR :
							nullable ?
								MAYBE :
								EMPTY
					} => cannot accept ${
						tagify(to)
					} as it is of type ${
						is.defined(to) ?
							to.constructor.name :
							to === null ?
								NULL :
								UNDEFINED
					}.`
				);
			},

			enumerable,
			configurable
		);
	}
}

export class MetaDescriptor extends Broadcaster {
	Type = class {};

	key = '';

	get = () => {};
	set = () => {};

	_value;

	_nullable;
	_required;
	_private;

	constructor(
		Type = class {},
		
		get =
			({ Type, target, key }) =>
				new Type,
		set =
			({ Type, target, key, to, from }) =>
				new Type,

		onchange =
			({ Type, target, key, to, from }) =>
				undefined
	) {
		super(onchange);

		Object.defineProperties(
			this,
			{
				...Properties.static(
					{
						Type,
						get,
						set
					},
					true
				),
				...Properties.variable(
					{
						key: '',

						_value: null,
	
						_nullable: false,
						_required: false,
						_private: false
					},
					false
				)
			}
		);
	}

	parse(key) {
		if (key.startsWith?.(UNDERSCORE)) {
			this.private;
			return (this.key = key);
		}

		if (key.endsWith?.(MAYBE))
			this.nullable;
		
		if (key.endsWith?.(STAR))
			this.required;

		return (
			this.key = key.slice(0, -1)
		);
	}

	init(key) {
		return new TypedAccessor(
			key,
			this.Type,
			
			this._value,
			this._nullable,
			this._required,

			({ type, target, key }) => {
				this.Type = type;
				return this.get({ type, target, key });
			},
			({ type, target, key, to, from }) => {
				return this.set({ type, target, key, to, from });
			},

			setdata =>
				this.dispatch(setdata),

			!this._private
		)
	}

	get nullable() {
		this._nullable = true;
		return this;
	}

	get required() {
		this._required = true;
		return this;
	}

	get private() {
		this._private = true;
		return this;
	}

	assign(
		value = new this.Type
	) {
		this._value = value;
		return this;
	}
}

export class Field extends MetaDescriptor {
	constructor(
		Type,
		onchange
	) {
		super(
			Type,
			() => this._value,
			({ to }) => to,
			onchange
		);
	}
}