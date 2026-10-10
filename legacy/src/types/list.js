import {
	Class
} from '../zed.js';

const validate =
	(items, T) =>
		items.every(
			item =>
				item instanceof T
		);

const error =
	T =>
		`List Item Error: All items must be of type ${ T.name }`;

export default class List extends Class(Set) {
	#Type;

	constructor(
		Type,
		...items
	) {
		if (!validate(items, Type))
			throw new TypeError(
				error(Type)
			);
		
		super(...items);
		this.#Type = Type;
	}

	add(item) {
		if (!(item instanceof this.#Type))
			throw new TypeError(
				error(this.#Type)
			);
		return super.add(item);
	}

	append(...items) {
		for (const item of items)
			this.add(item);
	}

	remove(...items) {
		for (const item of items)
			this.delete(item);
	}

	static defines
}