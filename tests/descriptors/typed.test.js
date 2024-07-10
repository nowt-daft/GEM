import { expect, mock } from "bun:test";
import TestSuite from "../testsuite.js";
import TypedAccessor from "../../src/descriptors/typed.js";

/**
 * @callback TestOperation
 * @param    {expect}  expect
 */

class TypedAccessorTest extends TestSuite {
	/**
	 * @param {string} name
	 * @param {TestOperation[]} tests
	 */
	constructor(
		name,
		tests
	) {
		super(
			`Typed Accessor Test: ${ name }`,
			(expect, [test_operation]) => test_operation(expect),
			tests.map(test => [test])
		);
	}
}

const mocker = mock();
const test_object = Object.defineProperties(
	{},
	{
		"number": new TypedAccessor(
			"number",
			Number,
			() => Math.random() * 5,
			({ from, to }) => to > from ? to : from,
			-1
		),
		"string": new TypedAccessor(
			"string",
			String,
			() => "DOES NOTHING",
			({ to }) => to,
			"default value"
		),
		"boolean": new TypedAccessor(
			"boolean",
			Boolean,
			({ key }) => key === "boolean",
			({ to }) => {
				mocker();
				return to;
			}
		)
	}
)

TestSuite.run(
	new TypedAccessorTest(
		'number',
		[
			expect => {
				expect(test_object.number).toBe(-1);
			},
			expect => {
				test_object.number = -3;
				expect(test_object.number).toBe(-1);
			},
			expect => {
				expect(test_object.number = 3).toBe(3);
			},
			expect => {
				expect(() => test_object.number = [1, 2, 3]).toThrow()
			}
		]
	),
	new TypedAccessorTest(
		"string",
		[
			expect => {
				expect(test_object.string).toBe("default value");
			},
			expect => {
				expect(test_object.string = "new value").toBe("new value")
			},
			expect => {
				expect(() => test_object.string = 42).toThrow();
			}
		]
	),
	new TypedAccessorTest(
		"boolean",
		[
			expect => {
				expect(test_object.boolean).toBe(true);
			},
			expect => {
				expect(test_object.boolean = true).toBe(true);
			},
			expect => {
				expect(mocker).toHaveBeenCalledTimes(0);
			},
			expect => {
				expect(test_object.boolean = false).toBe(false);
			},
			expect => {
				expect(mocker).toHaveBeenCalledTimes(1);
			}
		]
	)
);
