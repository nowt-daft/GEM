import TestSuite from "../testsuite.js";
import tagify, { tag } from "../../src/utils/tagify.js";

class TagifyTest extends TestSuite {
	/**
	 * @param    {string} type
	 * @param    {[any, string][]} tests
	 */
	constructor(
		type,
		tests
	) {
		super(
			`Tagify type => ${ type }`,
			(expect, [value], result) =>
				expect(tagify(value)).toBe(result),
			tests
		);
	}
}

class TagTest extends TestSuite {
	/**
	 * @param    {[string, string][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"Tagify Template Tag Function Test",
			(expect, [tagged], expected) =>
				expect(tagged).toBe(expected),
			tests
		)
	}
}

TestSuite.run(
	new TagifyTest(
		"undefined",
		[
			[undefined, 'UNDEFINED']
		]
	),
	new TagifyTest(
		"null",
		[
			[null, "NULL"]
		]
	),
	new TagifyTest(
		"boolean",
		[
			[true, "TRUE"],
			[false, "FALSE"],
			[new Boolean(1), "TRUE"],
			[new Boolean(''), "FALSE"]
		]
	),
	new TagifyTest(
		"string",
		[
			['', '""'],
			['Hello, World.', '"Hello, World."'],
			[new String("Wassup, planet?"), '"Wassup, planet?"']
		]
	),
	new TagifyTest(
		"number",
		[
			[0, "0"],
			[-1000, "-1000"],
			[3.145, "3.145"],
			[43/"number", "NaN"],
			[6/0, "Infinity"],
			[new Number(3), "3"]
		]
	),
	new TagifyTest(
		"bigint",
		[
			[
				1000000000000000000000000000000n,
				"1000000000000000000000000000000n"
			]
		]
	),
	new TagifyTest(
		"symbol",
		[
			[Symbol(), "symbol"],
			[Symbol("howdy"), 'symbol howdy'],
			[Symbol(42), "symbol 42"]
		]
	),
	new TagifyTest(
		"function",
		[
			[
				class TestClass {},
				"type TestClass"
			],
			[
				{ hello() { return "hello, world."; } }.hello,
				"method hello() {}"
			],
			[
				{ say_msg(msg) { return `"${ msg }"`; } }.say_msg,
				"method say_msg(msg) {}"
			],
			[
				(x = 2, y = 3, z = 4) => x * y * z,
				"(x = 2, y = 3, z = 4) => {}"
			],
			[
				function() {},
				"function anonymous() {}"
			],
			// TODO: In bun, false is !1. This is silly but likely a zig artefact.
			//[
			//	function(a, b = false) { return a && b; },
			//	"function <anonymous>(a, b = false) {}"
			//],
			[
				function named_func() {},
				"function named_func() {}"
			],
			[
				function named_func(x) { return x ** x; },
				"function named_func(x) {}"
			],
			[
				new Function("a", "b", "return a + b"),
				"function anonymous(a,b) {}"
			]
		]
	),
	new TagifyTest(
		"object",
		[
			[{}, "Object {}"],
			[[], "Array [0]"],
			[[1, 2, 3], "Array [3]"],
			[new Set([3, 3, 2, 1]), "Set [3]"],
			[new Map, "Map {0}"]
		]
	),
	new TagTest(
		[
			[tag`This boolean is ${ true }`, 'This boolean is TRUE'],
			[tag`And this one is ${ false }!`, 'And this one is FALSE!'],
			[
				tag`The array: ${ [1, 2, 3, 4] }, has a length of ${ 4 }`,
				'The array: Array [4], has a length of 4'
			],
			[
				tag`${
					{message: "Hello, World"}
				} has a key ${
					'message'
				} with value ${
					"Hello, World"
				}`,
				'Object {} has a key "message" with value "Hello, World"'
			]
		]
	)
);
