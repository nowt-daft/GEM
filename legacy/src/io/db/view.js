// This is essentially fine as is.  However, it might be
// better if View was an Entries type.  Therefore, building
// this with some sort of MataType.  It would be MORE CORRECT.
// That said, not too shabby. **LEAVE FOR NOW**

export default class View extends Array {
	#collection;

	constructor(
		type,
		query,
		listener = (view = this) => {}
	) {
		const collection = type.collection;
		super(...collection.query(query));

		this.#collection =
			collection.listen(
				collection =>
					this.#listener(
						collection,
						query,
						listener
					)
			);

		this.#listener(
			collection,
			query,
			listener
		);
	}

	#listener(
		collection,
		query,
		listener
	) {
		this.length = 0;
					
		for (const entry of collection.query(query))
			this.push(entry);

		listener(this);
	}

	dispose() {
		this.#collection.dispose();
	}
}