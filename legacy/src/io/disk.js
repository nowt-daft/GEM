// import { log as print } from 'console';

import {
	readFileSync,
	writeFileSync,
	existsSync,
	statSync,
	watch
} from 'fs';

import Serialise from './serialise.js';

import {
	Broadcaster
} from '../utils/broadcaster.js';

const DIR = process.env.DATA_DIR ?? 'data';
const ENCODING = 'utf8';
const CHANGE = 'change';

export const open = (
	file = '/'
) =>
	readFileSync(
		file,
		ENCODING
	);

export const save = (
	file = '/',
	data = ''
) =>
	writeFileSync(
		file,
		data,
		ENCODING
	);

export class Store extends Broadcaster {
	#cache;

	#path;
	#name;

	#watcher;

	#last_modified = 0;

	get path() {
		return this.#path;
	}

	get name() {
		return this.#name;
	}

	get data() {
		return (
			this.#cache ?? (
				this.#cache =
					Serialise.parse(open(this.#path))
			)
		);
	}

	get last_modified() {
		return statSync(this.path).mtimeMs;
	}

	constructor(
		name,
		_default = null
	) {
		super();

		const path = this.#path =
			`${ DIR }/${ this.#name = name }.json`;
		
		if (!existsSync(path))
			this.save(_default);

		this.#last_modified = this.last_modified;
		this.#watcher = watch(
			path,
			event => {
				if (
					event === CHANGE &&
					this.#last_modified < this.last_modified
				) {
					this.#last_modified = this.last_modified;
					this.dispatch(
						this.#clear_cache()
					);
				}
			}
		);
	}

	save(data) {
		this.#cache = data;
		this.dispatch(this);

		save(
			this.#path,
			Serialise.stringify(data)
		);
		return this;
	}

	kill() {
		// TODO: this needs to be cleaner...
		super.kill();
		this.#watcher.close();
	}

	#clear_cache() {
		this.#cache = undefined;
		return this;
	}
}
