import is from "../../../utils/is.js";

import Entry from "../entry.js";
import Collection from "./collection.js";

const constraints_satisfied = (
	entry = new Entry,
	constraints = {}
) =>
	Object
		.entries(
			constraints
		)
		.every(
			([key, value]) =>
				entry[key] === value
		);

export default class OneToMany extends Collection {
	#constraints = {};

	get constraints() {
		return this.#constraints;
	}

	get entries() {
		return super.entries.query(
			entry =>
				constraints_satisfied(
					entry,
					this.#constraints
				)
		);
	}

	constructor(
		schema = Entry,
		constraints = {}
	) {
		super(schema);
		this.#constraints = constraints;
	}

	create(
		data = {}
	) {
		return super.create({
			...this.#constraints,
			...data,
		});
	}

	add(
		entry = new Entry
	) {
		entry.constructor
			.update(
				entry.id,
				{
					...this.#constraints
				}
			);
		return this;
	}

	delete(
		query
	) {
		return super.delete(
			is.function(query) ?
				entry =>
					constraints_satisfied(
						entry,
						this.#constraints
					) &&
					query(entry) :
				query
		);
	}
}
