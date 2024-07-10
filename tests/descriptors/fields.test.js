import TestSuite from "../testsuite.js";
import { Field } from "../../src/descriptors/field.js";
import Fields from "../../src/descriptors/fields.js";

class FieldsTest extends TestSuite {
	/**
	 * @param {[object, object][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"Fields Constructor from Properties",
			(expect, [properties], fields) => {
				expect(new Fields(properties)).toMatchObject(fields);
			},
			tests
		);
	}
}

TestSuite.run(
	new FieldsTest([
		[{ a: 1 }, { a: Field.from(1).parse('a') }],
		[
			{ a: 42, _b: Boolean },
			{
				a: Field.from(42).parse('a'),
				_b: Field.type(Boolean).parse('_b')
			}
		]
	])
);
