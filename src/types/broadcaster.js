import is from "../utils/is.js";

/**
 * @template  {(message: any) => void}  Listener
 */
export class Broadcaster {
	/** @type {Listener[]} */
	#listeners = [];

	/**
	 * @param  {...Listener}  listeners
	 */
	constructor(...listeners) {
		this.#listeners = [...listeners];
	}

	/**
	 * Append a callback to the Broadcast
	 * @param    {Listener}  listener
	 * @returns  {Broadcaster<Listener>}  The current Broadcaster instance
	 */
	listen(listener) {
		this.#listeners = [
			...this.#listeners,
			listener
		];
		return this;
	}

	/**
	 * Remove a callback to the Broadcast
	 * @param   {Listener}  listener
	 * @returns {Broadcaster<Listener>}  The current Broadcaster instance
	 */
	unlisten(listener) {
		this.#listeners =
			this.#listeners.filter(
				l => l !== listener
			);
		return this;
	}

	/**
	 * Broadcast a message to all listeners
	 * @param    {any}  message
	 * @returns  {Broadcaster<Listener>}  The current Broadcaster instance
	 */
	dispatch(message) {
		for (const listener of this.#listeners)
			listener(message);
		return this;
	}

	/**
	 * Remove all listeners
	 * @returns  {Broadcaster<Listener>}  The current Broadcaster instance
	 */
	kill() {
		this.#listeners = [];
		return this;
	}
}

/**
 * @template  {(message: any) => void}  Listener
 */
export class ChannelBroadcaster {
	static DELIM = ':';

	/** @type {Map<string><Broadcaster<Listener>>} */
	#channels = new Map([
		['channel_name', new Broadcaster]
	]);

	/**
	 * @param  {...string|[string, ...Listener]}  channels
	 */
	constructor(
		...channels
	) {
		this.#channels = new Map(
			channels.map(
				channel =>
					is.string(channel) ?
						[
							/** @type {string} */
							channel,
							/** @type {Broadcaster<Listener>} */
							new Broadcaster
						] :
					is.array(channel) ?
						[
							/** @type {string} */
							channel.shift(),
							/** @type {Broadcaster<Listener>} */
							new Broadcaster(...channel)
						] :
					[]
			)
		);
	}

	/**
	 * @param    {string|symbol} channel
	 * @param    {Listener}      listener
	 * @returns  {ChannelBroadcaster<Listener>}  The current instance.
	 */
	listen(
		channel,
		listener
	) {
		if (this.#channels.has(channel))
			return this.#channels.get(channel).listen(listener), this;

		return this.#channels.set(
			channel,
			new Broadcaster(listener)
		), this;
	}

	/**
	 * @param    {Listener}  listener
	 * @returns  {ChannelBroadcaster<Listener>}  The current instance.
	 */
	unlisten(
		channel,
		listener
	) {
		return this.#channels.get(channel)?.unlisten(listener), this;
	}

	/**
	 * @param    {string|symbol}  channel
	 * @param    {any}            message
	 * @returns  {ChannelBroadcaster<Listener>}  The current instance.
	 */
	dispatch(
		channel,
		message
	) {
		this.#channels
			.get(channel)?.dispatch(message);

		const next_index = channel.lastIndexOf(ChannelBroadcaster.DELIM);

		if (next_index > -1)
			return this.dispatch(
				channel.slice(0, next_index),
				message
			);
		
		return this;
	}

	/**
	 * Remove all channels and listeners.
	 * @returns  {ChannelBroadcaster<Listener>}  The current instance.
	 */
	kill() {
		this.#channels = new Map([]);
		return this;
	}
}
