const COMMA = ',';

export default class Query {
	select;
	where;

	order_by;
	descending;

	skip;
	take;

	constructor({
		select,
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

	static by_id(
		id = 0,
		name = ''
	) {
		return name ?
			item => item[`${ name }_id`] == id :
			item => item.id == id;
	}

	static by_ids(
		ids = [0],
		name = ''
	) {
		return name ?
			item => ids.includes(item[`${ name }_id`]) :
			item => ids.includes(item.id);
	}

	static by_value(
		name = '',
		value
	) {
		return item => item[name] == value
	}

	static by_values(
		values = {}
	) {
		const entries = Object.entries(values);
		return item =>
			entries.every(
				([key, value]) =>
					item[key] == value
			)
	}
}
