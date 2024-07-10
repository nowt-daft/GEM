import { mock } from "bun:test";
import TestSuite from "../testsuite.js";
import delay from "../../src/utils/delay.js";

class DelayTest extends TestSuite {
	/**
	 * @param {number} [repeat=1] How many times to repeat the delay.
	 */
	constructor(
		repeat = 1
	) {
		super(
			`Delay Callback Test: REPEAT ${ repeat } TIMES.`,
			expect => {
				const callback = mock();
				
				for (let i = 0; i < repeat; i++)
					delay(callback);

				setTimeout(
					() =>
						expect(callback)
							.toBeCalledTimes(repeat),
					repeat * 125
				);
			},
			[[]]
		)
	}
}

TestSuite.run(
	new DelayTest(1),
	new DelayTest(5),
	new DelayTest(10)
);
