import { log as print } from 'console';

import {
	Store
} from '../disk.js';

import {
	MetaType
} from '../../zed.js';

import Property from '../../descriptors/property.js';
import Properties from '../../descriptors/properties.js';

import is from '../../utils/is.js';
import UInt from '../../types/number/uint.js';
import Any from '../../types/any.js';
import Entry from './entry.js';

import Query from './query.js';

import Collection from './collection/collection.js';
import OneToMany from './collection/onetomany.js';
import ManyToMany from './collection/manytomany.js';

const UNIQUE = '#';

// I was in the MIDDLE of organising things.  THis is something I shou;da have stated-on
// yesterday but oh well.

// We will get home and comb through this code bit by bit.

export class SchemaField extends SchemaDescriptor {
	_unique = false;

	constructor(
		schema = '',
		onchange = () => {}
	) {
		super(
			schema,
			() => this._value,
			(
				{
					entry: { id, constructor: Type },
					key,
					to,
					from
				}
			) => {
				if (
					this._unique &&
					Type
						.query(
							entry => id != +entry
						)
						.query({
							[key]: to
						})
						.length === 0
				) {
					throw SyntaxError(
						`ASSIGNMENT ERROR: Cannot set ${
							schema
						}[${ key }] as the given value MUST be UNIQUE.`
					);
					return from;
				}

				return to;
			},
			onchange
		);

		Object.defineProperties(
			this,
			Properties.variable(
				{
					_unique: false
				},
				false
			)
		);
	}

	get unique() {
		this._unique = true;
		return this;
	}

	parse(key) {
		if (key.startsWith?.(UNIQUE)) {
			this.unique;
			key = key.slice(1);
		}

		return super.init(key);
	}
}

const Schema = MetaType(
	'Schema',
	name => {
		const constructor = {
			[name]: class extends Entry {
				constructor(
					data = {}
				) {
					super(data);
				}
			}
		}[name];

		Object.defineProperties(
			constructor,
			Properties.static({
				store: new Store(
					name.toLowerCase(),
					[]
				)
			}, true)
		);

		Object.defineProperties(
			constructor,
			Properties.static({
				collection: new Collection(
					constructor,
					true
				)
			}, true)
		);

		Schema.defs.set(
			name,
			constructor
		);

		return constructor;
	},
	{
		create(data = {}) {
			return this.collection.create(data);
		},
		get(id = 0) {
			return this.collection.get(id);
		},
		query(id_or_query) {
			return this.collection.query(id_or_query);
		},
		update(
			id_or_query,
			data = {}
		) {
			return this.collection.update(
				id_or_query,
				data
			);
		},
		delete(
			id_or_query,
			data
		) {
			return this.collection.delete(
				id_or_query,
				data
			);
		},
		*[Symbol.iterator]() {
			for (const entry of this.collection.entries)
				yield entry;
		}
	}
);
Object.defineProperties(
	Schema,
	Properties.static(
		{
			defs: new Map(),
			ManyToMany(
				TypeA_name,
				TypeB_name,
				schema = {}
			) {
				// NAMES:
				const aToB = `${ TypeA_name }${ TypeB_name }`;
				const bToA = `${ TypeB_name }${ TypeA_name }`;
			
				// Schema:
				const through = Schema(
					aToB,
					{
						...Schema.Join.ManyToOne(TypeA_name),
						...Schema.Join.ManyToOne(TypeB_name),
						...schema
					}
				);
			
				Schema.defs.set(
					bToA,
					through
				);
			
				return through;
			},
			
			Join,
			
			Accessor: SchemaDescriptor,

			Get(
				Type = Any,
				get = entry => new Type
			) {
				if (is.undefined(get))
					return Schema.Get(
						Any,
						Type
					);

				return Schema.Accessor.Get(
					Type,
					({ entry }) =>
						get(entry),
				);
			},

			GetSet(
				Type = Any,
				get = entry => {},
				set = (entry, value) => {}
			) {
				if (is.undefined(set))
					return Schema.GetSet(
						Any,
						Type,
						get
					);
				
				return Schema.Accessor.GetSet(
					Type,
					({ entry }) => get(entry),
					({ entry, to: value }) => set(entry, value)
				);
			},

			Field: SchemaField
		},
		true
	)
);

// This is the hack for now...
globalThis.SchemaDefs = Schema.defs;
export default Schema;
