export class Broadcaster {
	#listeners = [];

	constructor(...listeners) {
		this.#listeners =
			[...listeners];
	}

	listen(listener) {
		this.#listeners = [
			...this.#listeners,
			listener
		];

		return this;
	}

	unlisten(listener) {
		this.#listeners =
			this.#listeners.filter(
				x => x !== listener
			);
		
		return this;
	}

	dispatch(msg) {
		for (const listener of this.#listeners)
			listener(msg);
		
		return this;
	}

	kill() {
		this.#listeners = [];
	}
}

export class ChannelBroadcaster {
	#channels =
		new Map([
			[
				'channel',
				[() => {}]
			]
		]);

	listen(
		channel,
		listener
	) {
		this.#channels.set(
			channel,
			(
				this.#channels.get(channel) ??
				[]
			)
			.concat(listener)
		);

		return this;
	}

	unlisten(
		channel,
		listener
	) {
		if (this.#channels.has(channel))
			this.#channels.set(
				channel,
				this.#channels
					.get(channel)
					.filter(
						x => x !== listener
					)
			);
		
		return this;
	}

	dispatch(
		channel,
		msg
	) {
		for (
			const listener of
			this.#channels.get(channel) ?? []
		)
			listener(msg);

		return this;
	}

	kill() {
		this.#channels = new Map;
	}
}
