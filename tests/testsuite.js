import { expect, test, describe } from "bun:test";
import print from "../src/io/print.js";

/**
 * @callback TestCallback
 * @param    {expect} expect
 * @param    {any[]} args
 * @param    {any} result
 * @returns  {void}
 */

export default class TestSuite {
	#tests = [];
	#operation = () => {};

	description = '';

	get size() {
		return this.#tests.length;
	}

	/**
	 * @param    {string} description
	 * @param    {TestCallback} operation
	 * @param    {[...any, any][]} [tests=[]] A list of arguments and last is the result.
	 */
	constructor(
		description,
		operation,
		tests = []
	) {
		this.description = description;
		this.#operation = operation;
		this.#tests = tests;
	}

	run() {
		const tests = [...this];
		const operation = this.#operation;

		describe(
			this.description,
			() => {
				tests.forEach(
					(test_run, index, { length }) => {
						const args = [...test_run];
						const result = args.length > 1 ? args.pop() : undefined;

						test(
							length > 1 ? `#${ index + 1 }` : '',
							() => {
								operation(
									expect,
									args,
									result
								);
							}
						);
					}
				);
			}
		);
	}

	*[Symbol.iterator]() {
		for (const test of this.#tests)
			yield test;
	}

	/**
	 * @param    {...TestSuite} tests
	 */
	static run(...tests) {
		print(
			`TOTAL TESTS: ${
				tests.reduce(
					(total, { size }) =>
						total + size,
					0
				)
			}`
		);
		for (const test of tests)
			test.run();
	}
}

