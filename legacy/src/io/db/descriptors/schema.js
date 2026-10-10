import is from "../../../utils/is.js";
import Any from "../../../types/any.js";

import { MetaDescriptor } from "../../../descriptors/accessor.js";

export default class SchemaDescriptor extends MetaDescriptor {
	constructor(
		Type = Any,
		get = ({ schema, entry, key }) => new Type,
		set = ({ schema, entry, key, from, to }) => new Type,
		onchange
	) {
		super(
			// Type/Schema of property
			is.string(Type) ?
				() => SchemaDefs.get(Type) :
				Type,
			
			// Property getter
			({ target: entry, key }) =>
				get({ schema, entry, key }),

			set ?
				({ target: entry, key, from, to }) =>
					set({ entry, key, from, to }) :
				({ entry: { constructor: { name } }, key }) => {
					throw new SyntaxError(
						`ASSIGNMENT ERROR: Cannot set property ${
							name
						}[${
							key
						}] that ONLY gets.`
					);
				},
			onchange
		);
	}

	static Get(
		Type = Any,
		get = ({ entry, key }) => new Type
	) {
		return (
			new SchemaDescriptor(
				Type,
				get
			).private
		);
	}

	static GetSet(
		Type = Any,
		get = ({ entry, key }) => new Type,
		set = ({ entry, key, from, to }) => new Type
	) {
		return (
			new SchemaDescriptor(
				Type,
				get,
				set
			).private
		);
	}
}