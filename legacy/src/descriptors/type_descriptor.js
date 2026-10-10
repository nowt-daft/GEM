import {
	log as print,
	warn
} from 'console';

import '../utils/object.js';
import is from '../utils/is.js';

import Accessor from './accessor.js';
import Fields from './fields.js';

const AT = '@';

const PROPERTIES = {
	[Symbol.species]:
		Accessor.Get(
			obj =>
				obj.constructor,
			false
		),
	[Symbol.toStringTag]:
		Accessor.Get(
			obj =>
				is.constructable(obj) ?
					`type ${
						obj.name
					}` :
					`${
						obj.constructor.name
					}`,
			false
		)
}

const PROTOTYPE = {
	inherit(
		parent,
		...args
	) {
		if (this.constructor?.parents.includes(parent))
			return Object.inherit(
				this,
				parent,
				...args
			);

		warn(
			new TypeError(
				`INHERITENCE ERROR: ${
					parent.name
				} is not a parent of ${
					this.constructor.name
				}`
			)
		);

		return this;
	},
	super(
		...arg_collection
	) {
		const parents = this.constructor?.parents ?? [];

		if (
			arg_collection.length !== parents.length
		)
			throw new TypeError(
				`INHERITENCE ERROR: ${
					this.constructor.name
				} has ${
					parents.length
				} parents but argument collection is of size ${
					arg_collection.length
				}.`
			);
		
		parents.forEach(
			(parent, index) =>
				Object.inherit(
					this,
					parent,
					...arg_collection[index]
				)
		);

		return this;
	}
};

export default class TypeDescriptor {
	// Reference to each parent from which our Type inherits
	parents = [];

	// The properties to be assigned to an instance
	prescriptor = {}; // <-- RAW
	properties = {}; //  <-- PROCESSED

	// METHODS
	prototype = {};
	listeners = {};

	// DEFAULT values to be assigned to instance
	defaults = {};
	
	constructor(
		...prescriptors
	) {
		let [
			prescriptor,
			...parents
		] = [
			prescriptors.pop(),
			...prescriptors
		];

		if (
			is.constructable(prescriptor)
		) {
			parents = parents.concat(prescriptor);
			prescriptor = undefined;
		}

		let {
			properties = {},
			prototype = {},
			defaults = {},
			listeners = {}
		 } =
			TypeDescriptor.sort(
				prescriptor,
				parents
			);

		const fields = new Fields(properties);
		
		prescriptor = Object.concat(
			...parents.map(
				parent => parent.prescriptor ?? {}
			),
			fields
		);
		
		properties = Object.concat(
			PROPERTIES,
			...parents.map(
				parent => parent.properties ?? {}
			),
			fields.init()
		);

		prototype = Object.concat(
			PROTOTYPE,
			...parents.map(
				parent => Object.view(parent.prototype)
			),
			prototype
		);

		defaults = Object.concat(
			...parents.map(
				parent => parent.defaults ?? {}
			),
			defaults
		);

		listeners =
			parents
				.map(
					parent => parent.listeners ?? {}
				)
				.concat(
					Object.map(
						listeners,
						(key, listener) => [
							key.slice(AT.length),
							[listener] // <-- this would have to be an Array?
						]
					)
				)
				.reduce(
					(all, listeners) => {
						Object.forEach(
							listeners,
							(key, listener) =>
								all[key] = (all[key] ?? []).concat(listener)
						);
						return all;
					},
					new Object
				)

		Object.assign(
			this,
			{
				parents,
				prescriptor,
				properties,
				prototype,
				defaults,
				listeners
			}
		);
	}

	static sort(
		prescriptor,
		parents = []
	) {
		if (!prescriptor)
			return {};

		const
			PROPERTY = 0,
			METHOD = 1,
			DEFAULT = 2,
			LISTENER = 3;

		const [
			properties,
			prototype,
			defaults,
			listeners
		] =
			Object.sort(
				prescriptor,
				(key, value) => {
					if (is.method(value))
						return (
							key.startsWith(AT) ?
								LISTENER :
								METHOD
						);
					
					if (
						is.literal(value) &&
						parents.some(
							parent =>
								Object.hasOwn(
									parent.properties ?? {},
									key
								)
						)
					)
						return DEFAULT;
					
					return PROPERTY;
				},
				[
					[], // PROPERTY BUCKET
					[], // METHOD BUCKET
					[], // DEFAULT VALUE BUCKET
					[]  // EVENT LISTENER BUCKET
				]
			);

		return {
			properties,
			prototype,
			defaults,
			listeners
		};
	}
}
