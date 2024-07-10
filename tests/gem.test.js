import { expect } from "bun:test";
import TestSuite from "./testsuite.js";
import { Model } from "../src/gem.js";

/**
 * @callback TypeTester
 *
 * @param    {class}   type
 * @param    {expect}  expect
 *
 * @returns  {void}
 */

class GemTest extends TestSuite {
	/**
	 * @param {string} name
	 * @param {TypeTester[]} tests
	 */
	constructor(
		name,
		tests
	) {
		super(
			`GEM => ${ name }`,
			(expect, [tester]) => tester(expect),
			tests.map(test => [test])
		);
	}
}

const A = Model({
	property: 42,
	value: Boolean
});

class B extends A {
	constructor(values = {}) {
		super({
			property: 69,
			value: true,
		}, values);
	}
}

class C extends B {
	constructor(values = {}) {
		super(values);
	}
}

class D extends Model(
	C,
	{
		"name*": String,
		"age?":  Number
	}
) {
	constructor(values = {}) {
		super(values);
	}
}

TestSuite.run(
	new GemTest(
		"Model",
		[
			expect => {
				const b = new B;
				expect(b.property).toBe(69);
				expect(b.value).toBe(true);
			},
			expect => {
				expect(() => {
					new C({
						beans: "Hello."
					});
				}).toThrow();
			},
			expect => {
				expect(() => {
					new D();
				}).toThrow();
			},
			expect => {
				const d = new D({ name: "Jane Doe" });
				expect(d.name).toBe("Jane Doe");
				expect(d.age).toBe(null);
			},
		]
	)
);

// TODO: MORE EXTENSIVE TESTS...
