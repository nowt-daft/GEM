import TestSuite from "../testsuite.js";
import Descriptor from "../../src/descriptors/descriptor.js";

class DescriptorTest extends TestSuite {
	/**
	 * @param {[...boolean, object][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"Descriptor",
			(expect, [enumerable, configurable], descriptor) =>
				expect(new Descriptor(enumerable, configurable)).toEqual(descriptor),
			tests
		)
	}
}

TestSuite.run(
	new DescriptorTest(
		[
			[true, true, { enumerable: true, configurable: true }],
			[true, { enumerable: true, configurable: true }],
			[false, { enumerable: false, configurable: true }],
			[false, false, { enumerable: false, configurable: false }]
		]
	)
);
