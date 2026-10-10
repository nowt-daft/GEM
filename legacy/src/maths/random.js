export const random =
	(
		a = 0,
		b = 1
	) =>
		Math.random() * (b - a) + a;

export const random_int =
	(
		a = 0,
		b = 1
	) =>
		Math.round(
			random(a, b)
		);

export const random_item =
	list =>
		list[
			random_int(
				0,
				list.length - 1
			)
		];

export const create_random =
	seed => {
		let [a, b, c, d] = hash(seed);

		return () => {
			let t = (a + b) | 0;

			a = b ^ b >>> 9;
			b = c + (c << 3) | 0;
			c = (c << 21 | c >>> 11);
			d = d + 1 | 0;

			t = t + d | 0;
			c = c + t | 0;
			
			return (t >>> 0) / 4294967296;
		;}
	}

const hash =
	seed => {
		let hash1 = [
			1779033703,
			3144134277,
			1013904242,
			2773480762
		];
		const hash2 = [
			597399067,
			2869860233,
			951274213,
			2716044179
		];
		const shifts = [18, 22, 17, 19];

		const a =
			(
				hashA,
				hashB,
				hashC,
				seed
			) =>
				hashB ^
				Math.imul(
					hashA ^ seed,
					hashC
				);
		
		const b =
			(
				hashA,
				hashB,
				hashC,
				shift
			) =>
				Math.imul(
					hashB ^ (
						hashA >>> shift
					),
					hashC
				);
		
		[
			...String(seed)
		].map(
			char => char.charCodeAt()
		).forEach(
			code =>
				hash1 = hash1.map(
					(_, index, hash1) =>
						a(
							hash1[index],
							hash1.at(index - 3),
							hash2[index],
							code
						)
				)
		);

		return hash1
				.map(
					(_, index, hash1) =>
						b(
							hash1[index],
							hash1.at(index - 2),
							hash2[index],
							shifts[index]
						)
				)
				.map(
					(hash, index, [h1, h2, h3, h4]) =>
						index ?
							hash ^ h1 :
							h2 ^ h3 ^ h4
				)
				.map(
					hash => hash >>> 0
				);
	}