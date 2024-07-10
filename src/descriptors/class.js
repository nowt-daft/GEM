import { init, sort, concat, view, forEach, map } from "../types/object.js";
import is from "../utils/is.js";

import InheritError from "../errors/inherit.js";
import MultiInheritError from "../errors/multi_inherit.js";

import Accessor from "./accessor.js";
import Fields from "./fields.js";

const AT = '@';
const
	PROPERTY = 0,
	METHOD = 1,
	DEFAULT = 2,
	LISTENER = 3;

const PROPERTIES_DESCRIPTOR = {
	[Symbol.species]:
		Accessor.Get(
			obj =>
				obj.constructor,
			false
		),
	[Symbol.toStringTag]:
		Accessor.Get(
			obj =>
				is.class(obj) ?
					`type ${ obj.name }` :
					`${ obj.constructor.name }`,
			false
		)
};

const PROTOTYPE = {
	inherit(
		parent,
		...args
	) {
		if (this.constructor.parents?.includes(parent))
			return init(
				this,
				parent,
				...args
			);

		throw new InheritError(this.constructor, parent);
	},
	super(
		...arg_collection
	) {
		const type = this.constructor;
		const parents = type.parents ?? [];

		if (arg_collection.length !== parents.length)
			throw new MultiInheritError(type, parents, arg_collection);

		return parents.reduce(
			(target, parent, index) => init(
				target,
				parent,
				...arg_collection[index]
			),
			this
		);
	}
};

export default class ClassDescriptor {
	parents = [];
	prescriptor = {};
	properties = {};
	prototype = {};
	listeners = {};
	defaults = {};

	/**
	 * @param {...object} prescriptors
	 */
	constructor(...prescriptors) {
		let [prescriptor, ...parents] = [
			is.object_literal(prescriptors.at(-1)) && prescriptors.pop(),
			...prescriptors
		];

		let [
			properties = {},
			prototype = {},
			defaults = {},
			listeners = {}
		] = ClassDescriptor.sort(
			prescriptor,
			parents
		);

		const fields = new Fields(properties);
		prescriptor = concat(
			...parents.map(
				p => p.prescriptor ?? {}
			),
			fields
		);
		properties = concat(
			PROPERTIES_DESCRIPTOR,
			...parents.map(
				p => p.properties ?? {}
			),
			fields.init()
		);
		prototype = concat(
			PROTOTYPE,
			...parents.map(
				p => view(p.prototype ?? {})
			),
			prototype
		);
		defaults = concat(
			...parents.map(
				p => p.defaults ?? {}
			),
			defaults
		);
		listeners =
			parents
				.map(p => p.listeners ?? {})
				.concat(
					map(
						listeners,
						(k, l) => [
							k.slice(AT.length),
							[l]
						]
					)
				)
				.reduce(
					(all, listeners) => {
						forEach(
							listeners,
							(k, ls) =>
								all[k] = [
									...(all[k] ?? []),
									...ls
								]
						);
						return all;
					},
					{}
				);
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

	/**
	 * @param    {any}      prescriptor
	 * @param    {class[]}  [parents=[]]
	 * @returns  {object[]}
	 */
	static sort(prescriptor, parents = []) {
		return sort(
			prescriptor || {},
			(key, value) => {
				if (is.method(value))
					return key.startsWith(AT) ? LISTENER : METHOD;

				return (
					is.literal(value) &&
					parents.some(
						p => Object.hasOwn(p.properties ?? {}, key)
					)
				) ? DEFAULT : PROPERTY;
			},
			4
		);
	}
}
