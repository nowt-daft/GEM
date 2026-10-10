import { log as print } from 'console';

import tagify from "./tagify.js";

const iterator =
	(
		obj,
		iter
	) =>
		Object.fromEntries(
			iter(
				Object.all_entries(obj)
			)
		);

export const concat = Object.concat =
	(...objects) =>
		Object.assign(
			{},
			...objects
		);

export const forEach = Object.forEach =
	(
		object = {},
		foreach = (key, value) => undefined
	) =>
		iterator(
			object,
			entries =>
				entries.forEach(
					([key, value]) =>
						foreach(key, value)
				) ?? entries
		);

export const map = Object.map =
	(
		object = {},
		map = (key, value) => [key, value]
	) =>
		iterator(
			object,
			entries =>
				entries.map(
					([key, value]) =>
						map(key, value)
				)
		);

export const filter = Object.filter =
	(
		object = {},
		filter = (key, value) => Boolean(value)
	) =>
		iterator(
			object,
			entries =>
				entries.filter(
					([key, value]) =>
						filter(key, value)
				)
		);

export const sort = Object.sort =
	(
		object = {},
		sort = (key, value) => undefined,
		_buckets = [] ?? {}
	) =>
		Object.entries(object)
			.reduce(
				(buckets, [key, value]) => {
					const target = sort(key, value);
					
					if (target > -1)
						(
							buckets[target] =
								buckets[target] ?? []
						).push([key, value]);

					return buckets;
				},
				_buckets
			).map(
				entries =>
					Object.fromEntries(entries ?? [])
			);

export const all_entries = Object.all_entries =
	(
		object = {}
	) =>
		[
			...Object.getOwnPropertyNames(object),
			...Object.getOwnPropertySymbols(object)
		]
			.map(
				key => [
					key,
					object[key]
				]
			);

export const view = Object.view =
	(
		object = {},
		...ignore_list
	) =>
		ignore_list = (
			[
				'constructor',
				'__proto__',
				...ignore_list
			]
		) &&
		Object.all_entries(object)
			.filter(
				([key]) =>
					!ignore_list.includes(key)
			);


export const inherit = Object.inherit =
	(
		object = {},
		{ prototype: { init } } = object.constructor,
		...args
	) => {
		if (typeof init === 'function')
			init.call(object, ...args);
		else if (args.length)
			return Object.assign(
				object,
				...args.filter(
					arg =>
						arg instanceof Object
				)
			);
		
		return object;
	}

export const verify = Object.verify =
	object => {
		const type = object.constructor;

		for (
			const [key, value] of
			Object.entries(object)
		) {
			const field = type.prescriptor[key];
			
			if (!field)
				throw new TypeError(
					`NOT DEFINED ERROR: property "${
						key
					}" is NOT defined by type ${
						type.name
					}.`
				);
			
			if (
				field._required &&
				(
					value === undefined ||
					(
						!field._nullable &&
						value === null
					)
				)
			)
				throw new TypeError(
					`REQUIREMENT ERROR: ${
						type.name
					}.${
						key
					}:${
						field.Type.name
					}`
				);
		}

		return object;
	}

export const init = Object.init =
	(
		object,
		...args
	) => {
		const type = object.constructor;
		
		return (
			Object.verify(
				Object.inherit(
					Object.assign(
						Object.defineProperties(
							object,
							type.properties ?? {}
						),
						type.defaults ?? {}
					),
					type,
					...args
				)
			)
		);
	}

Object.assign(
	Object.prototype,
	{
		toString() {
			return (
				`${
					this[Symbol.toStringTag] ?? 'Object'
				} {\n` +
				Object
					.entries(this)
					.map(
						([
							key,
							value
						]) =>
							`  ${ key }: ${ tagify(value) }`
					)
					.join(
						',\n'
					) +
					`\n}`
			);
		}
	}
);

export default Object;