import is from "../../utils/is.js";
import UInt from "../number/uint.js";

import { MetaType } from "../../gem.js";

import Query from "./query.js";

export default MetaType(
	"Entries<T>",
	(
		name, // <-- TODO: Are we able to make this a function as well?
		{ parents: [Entry] }
	) => {
		return {
			[name]: class extends Array {
				constructor(...entries) {
					if (
						entries.length === 1 &&
						is.number(entries[0])
					)
						super(entries[0]);
					else
						super(
							...entries
								.filter(
									entry => entry instanceof Object
								)
								.map(
									entry =>
										entry instanceof Entry ?
											entry :
											new Entry(entry)
								)
						);
				}

				/**
				 * TODO: FINISH DOCUMENTING AND TWEAKING THESE.
				 */
				get(
					id = 0
				) {
					const entry = this.query(id);
			
					if (!entry)
						throw new RangeError(
							`Cannot find entry of ${ name } with ID ${ id }`
						);
			
					return entry;
				}

				query(
					query
				) {
					if (query instanceof UInt)
						return this.find(
							Query.by_id(query)
						);

					if (query instanceof Array)
						return this.filter(
							Query.by_ids(query)
						);

					if (is.raw_object(query))
						return this.filter(
							Query.by_values(query)
						);
					
					if (is.function(query)) {
						return this.filter(
							query // Query.where if it existed
						);
					}

					if (query instanceof Query)
						return query.run(this);

					throw new TypeError(
						`Query must be an ID (UInt), a list of IDs, ` +
						`an object of values, a function, or ` +
						`a Query object`
					);
				}

				update(data = {}) {
					return this.map(
						entry =>
							entry.update(data)
					);
				}

				filter_out(
					predicate =
						(entry, index, entries) =>
							Boolean(entry && index && entries)
				) {
					return this.filter(
						(entry, index, entries) =>
							!predicate(entry, index, entries)
					);
				}
				/**
				 * END
				 */
			}
		}[name];
	}
).bind(
	globalThis,
	({ parents: [{ name }] }) => `Entries<${ name }>`
);
