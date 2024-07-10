import TestSuite from "../testsuite.js";
import Accessor from "../../src/descriptors/accessor.js";

/**
 * @callback ExpectTask
 * @returns  {any} What we we wish to pass to expect
 */

/**
 * @callback ExpectTest
 * @param    {object} matchers
 */

class AccessorTest extends TestSuite {
	/**
	 * @param  {string}  test
	 * @param  {[ExpectTask, ExpectTest][]} tests
	 */
	constructor(
		test,
		tests
	) {
		super(
			`Accessor ${ test } Test`,
			(expect, [task], test) => {
				test(expect(task()));
			},
			tests
		);
	}
}

TestSuite.run(
	new AccessorTest(
		"Getter",
		[
			[
				() => {
					const o = Object.defineProperty(
						{},
						"prop",
						Accessor.Get(
							"prop",
							({ target, key }) => {
								return { target, key };
							}
						)
					);

					return o.prop;
				},
				matchers => {
					matchers.toContainAllKeys(['target', 'key']);
				}
			],
			[
				() => {
					const o = Object.defineProperty(
						{},
						"some_prop",
						Accessor.Get(
							"some_prop",
							({ target, key }) => {
								return { target, key };
							}
						)
					);

					return o.some_prop.key;
				},
				matchers => {
					matchers.toBe("some_prop");
				}
			],
			[
				() => {
					return Object.defineProperty(
						{},
						"property",
						Accessor.Get(
							"property",
							() => "Hello, World."
						)
					);
				},
				matchers => {
					matchers.toEqual({ property: "Hello, World." });
				}
			],
		]
	),
	new AccessorTest(
		"Getter Error",
		[
			[
				() => {
					const o = Object.defineProperty(
						{},
						"readonly",
						Accessor.Get(
							"readonly",
							() => true
						)
					);

					return () => {
						if (o.readonly)
							o.readonly = 'Howdy!';
					};
				},
				matchers => {
					matchers.toThrow();
				}
			]
		]
	),
	new AccessorTest(
		"Getter 'n' Setter",
		[
			[
				() => {
					const obj = Object.defineProperty(
						{},
						"field",
						Accessor.GetSet(
							"field",
							() => Math.random() * 5,
							({ to }) => to,
						)
					);

					const value = obj.field;
					
					return obj.field === value;
				},
				matchers => matchers.toBe(true)
			],
			[
				() => {
					const o = Object.defineProperty(
						{},
						"property",
						Accessor.GetSet(
							"property",
							() => "old text",
							({ from, to }) => `OLD: "${ from }", NEW: "${ to }"`
						)
					);

					o.property = "new text";
					return o.property;
				},
				matchers => matchers.toBe('OLD: "old text", NEW: "new text"')
			]
		]
	)
);
