import UInt from "../number/uint.js";
import Entry from "./entry.js";

const COMMA = ',';

/**
 * @callback Selector
 * @param    {Entry}    entry
 * @param    {number}   index
 * @param    {Entry[]}  entries
 * @returns  {any}
 */

/**
 * @callback Where
 * @param    {Entry}    entry
 * @param    {number}   index
 * @param    {Entry[]}  entries
 * @returns  {boolean}
 */

export default class Query {
	/** @type {Selector} */
	select;
	/** @type {Where} */
	where;
	/** @type {string|string[]} */
	order_by;
	/** @type {boolean} */
	descending;

	/** @type {UInt} */
	skip;
	/** @type {UInt} */
	take;

	/**
	 * @param  {Object}          param0
	 * @param  {Selector}        param0.select
	 * @param  {Where}           param0.where
	 * @param  {string|string[]} param0.order_by
	 * @param  {boolean}         param0.descending
	 * @param  {UInt}            param0.skip
	 * @param  {UInt}            param0.take
	 */
	constructor({
		select = _ => _,
		where = _ => true,
		order_by = '',
		descending = false,
		skip = 0,
		take = 0
	} = {}) {
		Object.assign(
			this,
			{
				select,
				where,
				order_by,
				descending,
				skip,
				take
			}
		);
	}

	/**
	 * Run the query on a set of entries.
	 *
	 * @param    {Entry[]}  items
	 * @returns  {Entry[]}
	 */
	run(items = []) {
		const {
			select,
			where,
			order_by,
			descending,
			skip,
			take
		} = this;

		items = items.filter(where);

		if (order_by) {
			if (typeof order_by === 'string')
				order_by = order_by.split(COMMA).map(x => x.trim());

			if (order_by instanceof Array) {
				const properties = [...order_by];

				order_by = (itemA, itemB) => {
					let property;
					let result = 0;

					while (
						result === 0 &&
						(
							property = properties.shift()
						)
					) {
						const [a, b] =
							[itemA, itemB].map(
								item => item[property]
							);
						
						result = a < b ? -1 : a > b ? 1 : 0;
					}

					return result;
				};
			}

			const direction = descending ? -1 : 1;

			items = items.toSorted(
				(a, b) =>
					direction * order_by(a, b)
			);
		}

		items =
			items.slice(
				skip,
				take || items.length - skip
			);
		
		return (
			select ?
				[...items].map(select) :
				items
		);
	}

	/**
	 * @param    {UInt}    id
	 * @param    {string}  name
	 * @returns  {Where}
	 */
	static by_id(id, name = "") {
		return name ?
			item => item[`${ name }_id`] == id :
			item => item.id == id;
	}

	/**
	 * @param    {UInt[]}  ids
	 * @param    {string}  name
	 * @returns  {Where}
	 */
	static by_ids(ids, name = "") {
		return name ?
			item => ids.includes(item[`${ name }_id`]) :
			item => ids.includes(item.id);
	}

	/**
	 * @param    {string}  name
	 * @param    {any}     value
	 * @returns  {Where}
	 */
	static by_value(name, value) {
		return item => item[name] == value;
	}

	/**
	 * @param    {Record<string,any>}  values
	 * @returns  {Where}
	 */
	static by_values(values) {
		const entries = Object.entries(values);
		return item => {
			return entries.every(
				([key, value]) => item[key] == value
			);
		}
	}
}
