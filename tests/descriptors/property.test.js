import TestSuite from "../testsuite.js";
import Property from "../../src/descriptors/property.js";

class PropertyTest extends TestSuite {
	/**
	 * @param {[any, ...boolean, object][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"Proeperty Descriptor",
			(expect, [value, writable, enumerable, configurable], property) =>
				expect(new Property(value, writable, enumerable, configurable))
					.toEqual(property),
			tests
		)
	}
}

TestSuite.run(
	new PropertyTest([
		[
			42,
			false,
			false,
			{
				value: 42,
				writable: false,
				enumerable: false,
				configurable: true,
			}
		],
		[
			"Hello, World",
			true,
			true,
			false,
			{
				value: "Hello, World",
				writable: true,
				enumerable: true,
				configurable: false
			}
		]
	])
);

