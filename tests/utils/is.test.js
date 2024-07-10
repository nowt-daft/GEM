import TestSuite from "../testsuite.js";
import is from "../../src/utils/is.js";

class IsTest extends TestSuite {
	/**
	 * @param    {string} method_name
	 * @param    {[any, boolean][]} tests
	 */
	constructor(
		method_name,
		tests
	) {
		super(
			`is ${ method_name }`,
			(expect, [value], result) => {
				expect(is[method_name](value)).toBe(result);
			},
			tests
		);
	}
}

class IsTypeTest extends TestSuite {
	constructor(
		type,
		tests
	) {
		super(
			`is type the same as ${ type.name }`,
			(expect, [other_type], result) => {
				expect(is.type(other_type, type)).toBe(result);
			},
			tests
		);
	}
}

TestSuite.run(
	new IsTest(
		"defined",
		[
			[0, true],
			[false, true],
			[{}, true],
			[null, false],
			[undefined, false]
		]
	),
	new IsTest(
		"integer",
		[
			[0, true],
			[50.5, false],
			[Number.NEGATIVE_INFINITY, false],
			["1", false]
		]
	),
	new IsTest(
		"literal",
		[
			[1, true],
			[false, true],
			["HELLO, WORLD", true],
			[{}, false],
			[[1, 2, 3], false],
			["", true],
			[undefined, true],
			[null, true],
			[x => x ** x, false]
		]
	),
	new IsTest(
		"object_literal",
		[
			[{}, true],
			[{ a: 'value' }, true],
			[[], false],
			[new Map, false],
			[new Set, false]
		]
	),
	// TODO: test ASYNC functions...
	new IsTest(
		"function_literal",
		[
			[() => {}, false],
			[function(a, b) { return a + b; }, true],
			[function with_name() {}, true],
			[{ method() {} }.method, false]
		]
	),
	new IsTest(
		"lamda",
		[
			[() => {}, true],
			[x => x ** x, true],
			[function with_name() {}, false],
			[{ method() {} }.method, false]
		]
	),
	new IsTest(
		"method",
		[
			[() => {}, false],
			[{ method: function() {} }.method, false],
			[function with_name() {}, false],
			[{ method() {} }.method, true]
		]
	),
	new IsTest(
		"class",
		[
			[function() {}, false],
			[class {}, false],
			[class A {}, true],
			[Number, true]
		]
	),
	new IsTest(
		"global",
		[
			[this, true],
			[(() => this)(), true],
			[{ method() { return this; } }.method(), false]
		]
	),
	new IsTypeTest(
		Number,
		[
			[Number, true],
			[String, false],
			[(5).constructor, true]
		]
	),
	new IsTypeTest(
		String,
		[
			[String, true],
			[null, false],
			["Hello".constructor, true]
		]
	),
	new IsTypeTest(
		Array,
		[
			[Array, true],
			[[].constructor, true],
			[
				class Entries extends Array {
					constructor(...items) {
						super(...items);
					}
				},
				true
			]
		]
	)
);

