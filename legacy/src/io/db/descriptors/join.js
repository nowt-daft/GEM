import Entry from '../entry.js';
import SchemaDescriptor from './schema.js';

export class Join extends SchemaDescriptor {
	schema;

	constructor(
		schema = '',
		getter =
			({
				entry = new Entry,
				schema = Entry
			}) => {},
		setter =
			({
				entry = new Entry,
				schema = Entry,
				value
			}) => {}
	) {
		super(
			schema,
			({ entry }) => ,
			() => {

			}
		);
		super(
			{
				get() {
					if (this[hidden])
						return this[hidden];

					const schema =
						Schema.defs.get(schema);
					const entry = this;

					return Object.defineProperty(
						this,
						hidden,
						Property.variable(
							getter({
								schema,
								entry
							})
						)
					) && this[hidden];
				},
				set(value) {
					const schema =
						Schema.defs.get(schema);
					const entry = this;

					setter({
						schema,
						entry,
						value
					});

					return (
						this[hidden] =
							getter({
								schema,
								entry
							})
					);
				}
			},
			false
		);

		this.schema = schema;
	}

	static OneToMany(
		schema_name
	) {
		return new Join(
			schema_name,
			({ entry, schema }) => {
				const {
					id,
					constructor: { name }
				} = entry;

				return new OneToMany(
					schema,
					{
						[`${ name.toLowerCase() }_id`]: id
					}
				);
			},
			({
				entry,
				schema,
				value: new_entries
			}) => {
				if (!(new_entries instanceof Array))
					throw new TypeError(
						`ASSIGNMENT ERROR: Value must be an Array`
					);

				if (
					new_entries.every(
						val => val instanceof UInt
					)
				)
					new_entries =
						new_entries.map(
							val => schema.get(val)
						)
				else if (
					new_entries.every(
						val => is.raw_object(val)
					)
				)
					new_entries =
						new_entries.map(
							entry => schema.create(entry)
						);

				if (
					new_entries.every(
						val => val instanceof schema
					)
				)
					new_entries =
						new_entries.map(
							({ id }) => id
						);
				else
					throw new TypeError(
						`ASSIGNMENT ERROR: Value must be an Array of type Entry<${
							schema_name
						}>, IDs, or Object literals.`
					);

				
				const name =
					entry.constructor.name.toLowerCase();

				const field = `${ name }_id`;

				schema.update(
					Query.by_id(
						entry.id,
						name
					),
					{
						[field]: null
					}
				);
				
				schema.update(
					Query.by_ids(new_entries),
					{
						[field]: entry.id
					}
				);

				return new_entries;
			}
		);
	}

	static ManyToOne(
		schema_name,
		field_name = schema_name.toLowerCase(),
		key_name = `${ field_name }_id`
	) {
		return {
			[key_name]: UInt,
			[field_name]: new Schema.Join(
				schema_name,
				({ schema, entry }) =>
					schema.get(entry[key_name]),
				({
					entry,
					schema,
					value: joined_entry
				}) => {

					if (joined_entry instanceof UInt)
						joined_entry =
							schema.get(joined_entry);
					
					else if (is.raw_object(joined_entry))
						joined_entry =
							schema.create(joined_entry);

					
					if (joined_entry instanceof schema)
						joined_entry = joined_entry.id;
					else
						throw new TypeError(
							`ASSIGNMENT ERROR: Value must be of type Entry<${
								schema_name
							}>, an ID, or an Object literal.`
						);

					entry.constructor.update(
						entry.id,
						{
							[key_name]: joined_entry
						}
					);
				}
			)
		};
	}

	static ManyToMany(
		schema_name,
		field_name = schema_name.toLowerCase()
	) {
		return new Schema.Join(
			schema_name,
			({ entry }) => {
				const {
					id,
					constructor: { name }
				} = entry;

				return new ManyToMany(
					Schema.defs.get(`${ schema_name }${ name }`),
					{
						[`${ name.toLowerCase() }_id`]: id
					},
					entry => entry[field_name]
				);
			},

			({
				entry,
				schema,
				value
			}) => {
				if (!(value instanceof Array))
					throw new TypeError(
						`ASSIGNMENT ERROR: Value must be an Array.`
					);
				
				
				if (
					value.every(
						val => val instanceof UInt
					)
				)
					value =
						value.map(
							ID =>
								Object({ entry: ID, data: {} })
						);
				else if (
					value.every(
						val => val instanceof schema
					)
				)
					value =
						value.map(
							entry =>
								Object({ entry, data: {} })
						);

				

				if (
					value.every(
						({ entry }) => entry instanceof UInt
					)
				)
					value =
						value.map(
							({ entry, data }) =>
								Object({ entry: schema.get(entry), data })
						);
				else if (
					value.every(
						({ entry }) => is.raw_object(entry)
					)
				)
					value =
						value.map(
							({ entry, data }) =>
								Object({ entry: schema.create(entry), data })
						);

				
				if (
					value.every(
						({ entry }) => entry instanceof schema)
				)
					value =
						value.map(
							({ entry, data }) =>
								Object({ entry: entry.id, data })
						);
				else
					throw new TypeError(
						`ASSIGNMENT ERROR: The entry values must be of type Entry<${ schema_name }>`
					);


				const {
					id: entry_id,
					constructor: { name }
				} = entry;

				const ThroughSchema = Schema.defs.get(
					`${ schema_name }${ name }`
				);
				const key_name = name.toLowerCase();

				ThroughSchema.delete(
					Query.by_id(
						entry_id,
						key_name
					)
				);

				for (const { entry: new_entry_id, data } of value) {
					ThroughSchema.create({
						...data,
						[`${ key_name }_id`]: entry_id,
						[`${ field_name }_id`]: new_entry_id
					});
				}
				
				return value;
			}
		);
	}
}