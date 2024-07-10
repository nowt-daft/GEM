import { expect } from "bun:test";
import TestSuite from "../testsuite.js";
import MetaDescriptor from "../../src/descriptors/meta.js";

/**
 * @callback DescriptorTester
 * @param    {MetaDescriptor}  descriptor
 * @param    {expect}  expect
 */

class MetaTest extends TestSuite {
	/**
	 * @param {DescriptorTester[]} tests
	 */
	constructor(
		tests
	) {
		const descriptor = new MetaDescriptor(
			Number,
			() => {},
			({ to }) => to
		)
		.assign(42)

		super(
			"MetaDescriptor basics tests",
			(expect, [test]) => {
				test(descriptor, expect);
			},
			tests.map(test => [test])
		);
	}
}

TestSuite.run(
	new MetaTest([
		(descriptor, expect) => {
			expect(descriptor).toMatchObject(
				{
					type: Number,
					key: '',
					//get;
					//set;
					value: 42,
					is_nullable: false,
					is_required: false,
					is_private: false
				}
			);
		},
		(descriptor, expect) => {
			expect(descriptor.parse("_property?")).toMatchObject({
				type: Number,
				key: '_property',
				value: 42,
				is_nullable: true,
				is_required: false,
				is_private: true
			});
		},
		
	])
);
