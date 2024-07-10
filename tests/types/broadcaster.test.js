import { mock } from "bun:test";
import TestSuite from "../testsuite.js";
import { Broadcaster, ChannelBroadcaster } from "../../src/types/broadcaster.js";

class BroadcasterTest extends TestSuite {
	constructor() {
		super(
			"Broadcaster LISTEN/UNLISTEN/DISPATCH Test",
			expect => {
				const mock_listener = mock(msg => console.log(msg));
				
				new Broadcaster(
					msg => mock_listener(msg)
				)
				.listen(msg => mock_listener(msg))
				.listen(mock_listener)
				.dispatch("Hello, world.")
				.unlisten(mock_listener)
				.dispatch("Goodbye, World.")
				.kill()
				.dispatch("This will not be displayed.")

				expect(mock_listener).toBeCalledTimes(5);
			},
			[[]]
		)
	}
}

class ChannelBroadcasterTest extends TestSuite {
	constructor() {
		super(
			"Channel Broadcaster Test: CONSTRUCT AND DISPATCH",
			expect => {
				const mock_listener = mock(msg => console.log(msg));

				new ChannelBroadcaster(
					'channel',
					['other_channel', mock_listener],
					['other_channel:sub_channel', msg => mock_listener(msg)]
				)
				.listen('channel', mock_listener)
				.dispatch('channel', "Hello.")
				.dispatch('other_channel', "Bye.")

				.unlisten('other_channel', mock_listener)
				.dispatch('other_channel', "Will not be called.")
				.listen('other_channel', msg => mock_listener(msg))
				
				.dispatch('other_channel:sub_channel:no_listeners', "called twice.");

				expect(mock_listener).toBeCalledTimes(4);
			},
			[[]]
		);
	}
}

TestSuite.run(
	new BroadcasterTest,
	new ChannelBroadcasterTest
);
