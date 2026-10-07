import {
	sort,
	concat,
	view,
	forEach,
	map
} from "../types/object.js";
import is from "../utils/is.js";

import Accessor from "./accessor.js";
import Fields from "./fields.js";

/**
 * @typedef {import('./fields.js').Key} Key
 */
/**
 * @typedef {class[]} Parents
 */
/**
 * @typedef {Record<Key,function>} Prototype
 */
/**
 * @typedef {Record<Key,function[]>} Listeners
 */
/**
 * @typedef {import('./fields.js').FieldDescriptors} FieldDescriptors
 */
/**
 * @typedef {import('./fields.js').Descriptors} Descriptors
 */
/**
 * @typedef {import('./fields.js').Dictionary} Dictionary
 */

/**
 * TODO: MIGRATE PROPERTIES_DESCRIPTOR and PROTOTYPE to GEM file.
 * perhaps.... it might JUST be PROTOTYPE that gets moved. It would
 * certainly be easier...
 */

const AT = '@';
const
	PROPERTY = 0,
	METHOD = 1,
	DEFAULT = 2,
	LISTENER = 3;

/**
 * @mixin
 */
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
		),
};

export default class ClassDescriptor {
	/** @type {Parents} */
	parents = [];
	/** @type {FieldDescriptors} */
	prescriptor = {};
	/** @type {Descriptors} */
	properties = {};
	/** @type {Prototype} */
	prototype = {};
	/** @type {Listeners} */
	listeners = {};
	/** @type {Dictionary} */
	defaults = {};

	/**
	 * @param {...object} prescriptors
	 */
	constructor(...prescriptors) {
		let [parents, prescriptor = {}] = [
			is.array(prescriptors.at(0)) ?
				prescriptors.shift() :
				[],
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

		const fields = Fields.create(properties);
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
			Fields.to_descriptors(fields)
		);
		prototype = concat(
			// PROTOTYPE,
			...parents.map(
				p => (
					p == globalThis.HTMLElement || p == globalThis.Element
				) ? {} : view(p.prototype ?? {})
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
	 * @param    {Dictionary} prescriptor
	 * @param    {Parents}    parents
	 * @returns  {object[]}
	 */
	static sort(prescriptor, parents = []) {
		return sort(
			prescriptor || {},
			(key, value) => {
				if (
					is.object_literal(value)
				) {
					if (
						is.object_literal(value) &&
						is.method(value.method) &&
						is.class(value.returns)
					)
						return METHOD;

					// TODO: Add logic for an object_literal to
					// be added as a DEFAULT...
				}

				if (
					is.method(value)
				) {
					return is.string(key) && key.startsWith(AT) ? LISTENER : METHOD;
				}

				return (
					is.literal(value) &&
					parents.some(
						// TODO: We should, in fact, do some TYPE
						// CHECKING here... otherwise we could get
						// some weird bugs...
						p => Object.hasOwn(p.properties ?? {}, key)
					)
				) ? DEFAULT : PROPERTY;
			},
			4
		);
	}
}
