import { log as print } from 'console';

import is from '../../../utils/is.js';

import { Broadcaster } from '../../../utils/broadcaster.js';

import Query from '../query.js';
import Entry from '../entry.js';
import Entries from '../entries.js';

export default class Collection extends Broadcaster {
	#cache;

	#serial;
	#schema;
	#listener;

	constructor(
		schema = Entry,
		watch_store = false
	) {
		super();
		
		this.#schema = schema;

		if (watch_store) {
			schema.store.listen(
				this.#listener =
					() => this.clear()
			);
		}
	}

	get serial() {
		if (is.number(this.#serial))
			return ++this.#serial;

		return (
			this.#serial =
				(
					this.all_entries.at(-1)?.id ??
					-1
				) + 1
		);
	}

	set serial(value) {
		return this.#serial = value;
	}

	get entries() {
		return this.all_entries;
	}

	get all_entries() {
		return this.#cache ?? (
			this.#cache =
				new (Entries(this.#schema))(
					...this.#schema.store.data
				)
		);
	}

	get size() {
		return this.entries.length;
	}

	create(
		data = {}
	) {
		const entry = new this.#schema({
			id: this.serial,
			...data
		});

		this.#concat(entry);

		return entry;
	}

	query(
		query
	) {
		return this.entries.query(query);
	}

	at(
		index = 0
	) {
		return this.entries.at(index);
	}

	get(
		id = 0
	) {
		const entry = this.entries.find(
			Query.by_id(id)
		);

		if (!entry)
			throw new RangeError(
				`Cannot find ${
					this.#schema.name
				} entry with ID ${
					id
				}`
			);

		return entry;
	}

	add(
		entry = new Entry
	) {
		return this.#concat(entry);
	}

	update(
		query,
		data = {}
	) {
		this.query(query).update(data);
		return this.save();
	}

	delete(
		query
	) {
		return this.save(
			this.all_entries.filter_out(
				is.function(query) ?
					query :
					Query.by_id(query)
				)
		);
	}

	#concat(
		entry = new Entry
	) {
		return this.save(
			this.all_entries.concat(
				entry
			)
		);
	}

	save(items = this.all_entries) {
		
		this.#schema.store.save(
			[...items]
				.map(
					entry => {
						return { ...entry };
					}
				)
		);

		return this.clear();
	}

	clear() {
		this.#cache = undefined;
		return this.dispatch(this);
	}

	dispose() {
		this.kill();

		if (this.#listener)
			this.#schema.store.unlisten(
				this.#listener
			);
	}

	*[Symbol.iterator]() {
		for (const entry of this.entries)
			yield entry;
	}
}