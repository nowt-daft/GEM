import { mock } from "bun:test";
import TestSuite from "../testsuite.js";
import Object from "../../src/types/object.js";

/**
 * @typedef  {import("../../src/types/object.js").Sort} Sorter
 */

class ObjectTest extends TestSuite {
	/**
	 * @param    {string} fn  Function to test
	 * @param    {import("../testsuite.js").TestCallback} operation
	 * @param    {[...any, any][]} tests
	 */
	constructor(
		fn,
		operation,
		tests
	) {
		super(
			`Object.${ fn }`,
			operation,
			tests
		);
	}
}

class BasicObjectTest extends ObjectTest {
	/**
	 * @param    {string} fn  Function to test
	 * @param    {[...object, object][]} tests
	 */
	constructor(
		fn,
		tests
	) {
		super(
			fn,
			(expect, objects, object) =>
				expect(
					Object[fn](...objects)
				).toEqual(object),
			tests
		);
	}
}

class EntriesObjectTest extends ObjectTest {
	/**
	 * @param    {string} fn  Function to test
	 * @param    {[object, string[]|symbol[]][]} tests
	 */
	constructor(
		fn,
		tests
	) {
		super(
			fn,
			(expect, [object], keys) =>
				expect(
					Object.fromEntries(
						Object[fn](object)
					)
				).toContainAllKeys(keys),
			tests
		);
	}
}

class IterateObjectTest extends ObjectTest {
	/**
	 * @param    {string} fn  Function to test
	 * @param    {[object][]} tests
	 */
	constructor(
		fn,
		tests
	) {
		super(
			fn,
			(expect, [object = {}]) => {
				const size = Object.keys(object).length;
				const callback = mock((key, value) => [key, value]);

				Object[fn](
					object,
					callback
				);

				expect(callback).toHaveBeenCalledTimes(size);
			},
			tests
		);
	}
}

class ModifyObjectTest extends ObjectTest {
	/**
	 * @param    {string} fn  Function to test
	 * @param    {[object, function, object][]} tests
	 */
	constructor(
		fn,
		tests
	) {
		super(
			fn,
			(expect, [target, predicate], object) =>
				expect(
					Object[fn](
						target,
						predicate
					)
				).toEqual(object),
			tests
		);
	}
}

class SortObjectTest extends ObjectTest {
	/**
	 * @param    {[object, Sorter, object[]][]} tests
	 */
	constructor(
		tests
	) {
		super(
			"sort",
			(expect, [target, sorter], objects_list) =>
				expect(
					Object.sort(
						target,
						sorter,
						objects_list.length
					)
				).toEqual(
					objects_list
				),
			tests
		);
	}
}

TestSuite.run(
	new BasicObjectTest(
		"concat",
		[
			[{ a: 1 }, { b: 2 }, { c: 3 }, { a: 1, b: 2, c: 3 }]
		]
	),
	new EntriesObjectTest(
		"all_entries",
		[
			[
				Array.prototype,
				[
					'length', 'constructor', 'at', 'concat',
					'copyWithin', 'fill', 'find', 'findIndex',
					'findLast', 'findLastIndex', 'lastIndexOf', 'pop',
					'push', 'reverse', 'shift', 'unshift', 'slice',
					'sort', 'splice', 'includes', 'indexOf', 'join',
					'keys', 'entries', 'values', 'forEach', 'filter',
					'flat', 'flatMap', 'map', 'every', 'some', 'reduce',
					'reduceRight', 'toLocaleString', 'toString', 'toReversed',
					'toSorted', 'toSpliced', 'with'
				]
			]
		]
	),
	new IterateObjectTest(
		"forEach",
		[
			[{ a: 1, b: 2, c: 3 }],
			[{ a: 0, b: 1 }],
			[{ a: -1 }],
			[{}]
		]
	),
	new ModifyObjectTest(
		"map",
		[
			[
				{ a: 1, b: 2 },
				(key, value) => [key, value * value],
				{ a: 1, b: 4 }
			],
			[
				{ a: 2, b: 3, c: -4 },
				(key, value) => [key + key, value * value],
				{ aa: 4, bb: 9, cc: 16 }
			]
		]
	),
	new ModifyObjectTest(
		"filter",
		[
			[
				{
					a: 1, b: 2, c: 3,
					d: 4, e: 5, f: 6
				},
				(_, value) => value % 2,
				{
					a: 1, c: 3, e: 5
				}
			],
			// more...
		]
	),
	new SortObjectTest(
		[
			[
				{ a: 1, b: false, c: "hello", d: true },
				(_, value) => {
					// SORT by TYPE: [numbers, booleans, strings]
					const buckets = [
						0,
						true,
						""
					].map(
						val => typeof val
					);

					return buckets.indexOf(typeof value);
				},
				[{ a: 1 }, { b: false, d: true }, { c: "hello" }]
			],
			[
				{ a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6 },
				(_, value) => {
					// SORT by EVEN/ODD: [evens, odds]
					return value % 2;
				},
				[{ a: 0, c: 2, e: 4, g: 6 }, { b: 1, d: 3, f: 5 }]
			]
		]
	),
	// TODO: Do we do any VIEW tests?
	//new BasicObjectTest(
	//	"view",
	//	[
	//		[{}]
	//	]
	//)
	new BasicObjectTest(
		"init",
		[
			[{}, Object, { a: 1 }, { b: 2 }, { a: 1, b: 2 }],
			(() => {
				class A {
					init() {
						Object.assign(
							this,
							{
								z: "Hello."
							}
						)
					}
				}

				class B extends A {
					constructor() {
						super();
					}
				}

				return [new B, B, { z: "Hello." }];
			})()
		]
	),
	// TODO: Once GEM is implemented, we need to test ->
	// Object.verify AND Object.construct
	// Then we can move on to bigger things!
);

//class ConstructObjectTest extends ObjectTest {
//
//}
