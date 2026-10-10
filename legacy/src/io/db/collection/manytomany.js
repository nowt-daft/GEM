import { log as print } from 'console';

import Entry from "../entry.js";
import OneToMany from "./onetomany.js";

export default class ManyToMany extends OneToMany {
	#map = entry => entry;

	get through_entries() {
		return super.entries;
	}

	get entries() {
		return this.through_entries.map(this.#map);
	}

	constructor(
		schema = Entry,
		constraints = {},
		map = entry => entry
	) {
		super(
			schema,
			constraints
		);
		this.#map = map;
	}

	add(
		{ id, constructor: Type } = new Entry,
		data = {}
	) {
		this.create(
			{
				...this.constraints,
				[`${ Type.name.toLowerCase() }_id`]: id,
				...data,
			}
		);
		return this;
	}

	query(
		query,
		map = this.#map
	) {
		return this.through_entries
					.query(query)
					.map(map);
	}

	update(
		query,
		data = {}
	) {
		this.through_entries
			.query(query)
			.update(data)
			.map(
				entry =>
					Object({ ...entry })
			);
		return this.save();
	}

	// many-to-many relationships need a map
	// so we can get data from BOTH the Through Model
	// AND the regular model

	// this might be something we can include in collections in general
	// Could be the same for some basic query things like:
	// SELECT, WHERE, ORDER_BY, DESC, TAKE, GROUP, ETC...
	select(
		mapper = entry => Object()
	) {
		return [...this.through_entries].map(mapper);
	}
}