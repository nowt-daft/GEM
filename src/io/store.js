import { stringify, parse } from "./serialise.js";
import { open, watch } from "./disk.js";
import { Broadcaster } from "../types/broadcaster.js";

const DIR = process.env.DATA_DIR ?? 'data';

/**
 * @class Store
 * @extends Broadcaster<Store>
 */
export class Store extends Broadcaster {
	#cache;

	#path;
	#name;
	#default;
	#watcher;

	/**
	 * @returns  {string}  Path to store file
	 */
	get path() {
		return this.#path;
	}

	/**
	 * @returns  {string}  The name of this Store.
	 */
	get name() {
		return this.#name;
	}

	/**
	 * @param    {string}  name
	 * @param    {any}     _default=null
	 */
	constructor(
		name,
		_default = null
	) {
		super();

		const path = this.#path =
			`${ DIR }/${ this.#name = name }.json`;

		this.#default = _default;
		this.#watcher = watch(
			path,
			_ => {
				this.dispatch(
					this.#clear_cache()
				);
			}
		);
	}

	async read() {
		if (this.#cache)
			return this.#cache;

		const contents = await open(this.#path);
		return this.#cache = contents ? parse(contents) : this.#default;
	}

	save(data) {
		this.#cache = data;
		this.dispatch(this);

		save(
			this.#path,
			stringify(data)
		);

		return this;
	}

	kill() {
		// TODO: this needs to be cleaner...
		this.#watcher.close();
		return super.kill();
	}

	#clear_cache() {
		this.#cache = undefined;
		return this;
	}
}
