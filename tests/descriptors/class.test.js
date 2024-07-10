import TestSuite from "../testsuite.js";

import { Field } from "../../src/descriptors/field.js";
import ClassDescriptor from "../../src/descriptors/class.js";

class ClassDescriptorTest extends TestSuite {
	/**
	 * @param {[...object, object][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"Class Description",
			(expect, prescriptors, descriptor) => {
				console.log(
					new ClassDescriptor(...prescriptors)
				);
				expect(new ClassDescriptor(...prescriptors)).toMatchObject(descriptor);
			},
			tests
		);
	}
}

TestSuite.run(
	new ClassDescriptorTest([
		[
			{ a: Number },
			{
				prescriptor: {
					a: Field.type(Number).parse('a')
				},
				properties: {
					a: {
						enumerable: true,
						configurable: true
					}
				}
			}
		]
	])
);
