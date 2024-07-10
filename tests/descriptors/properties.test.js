import TestSuite from "../testsuite.js";
import Properties from "../../src/descriptors/properties.js";
import { FixedProperty } from "../../src/descriptors/property.js";

class PropertiesTest extends TestSuite {
	/**
	 * @param {"fixed"|"variable"}  type
	 * @param {[object, boolean, object][]} tests
	 */
	constructor(
		type,
		tests
	) {
		super(
			`${ type.toUpperCase() } Properties Descriptor`,
			(expect, [properties, enumerable], expected) =>
				expect(Properties[type](properties, enumerable))
					.toEqual(expected),
			tests
		)
	}
}

TestSuite.run(
	new PropertiesTest(
		"fixed",
		[
			[{}, false, {}],
			[
				{ a: 42, b: "hello, world." },
				true,
				{
					a: {
						value: 42,
						writable: false,
						enumerable: true,
						configurable: true
					},
					b: {
						value: "hello, world.",
						writable: false,
						enumerable: true,
						configurable: true
					}
				}
			]
		]
	),
	new PropertiesTest(
		"variable",
		[
			[{}, true, {}],
			[
				{
					a: 42,
					b: "hello, world.",
					c: new FixedProperty(
						true,
						true,
						false
					)
				},
				false,
				{
					a: {
						value: 42,
						writable: true,
						enumerable: false,
						configurable: true,
					},
					b: {
						value: "hello, world.",
						writable: true,
						enumerable: false,
						configurable: true,
					},
					c: {
						value: true,
						writable: false,
						enumerable: true,
						configurable: false
					}
				}
			]
		]
	)
);

