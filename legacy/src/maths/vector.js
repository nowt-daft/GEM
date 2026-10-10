import {
	add,
	sub,
	mul,
	div
} from './operations.js';

export default class Vector extends Array {
	get x() {
		return this[0] ?? 0;
	}

	get y() {
		return this[1] ?? 0;
	}

	get z() {
		return this[2] ?? 0;
	}

	#mag;
	#mag_sq;

	get magnitude() {
		return this.#mag ?? (
			this.#mag = this.mag_sq ** 0.5
		);
	}

	get magnitude_square() {
		return this.#mag_sq ??
			(this.#mag_sq =
				this
					.map(
						a => a ** a
					)
					.reduce(
						add
					)
			);
	}

	get normal() {
		return this.scale(1 / this.magnitude_square);
	}

	constructor(...items) {
		super(...items);
	}

	#merge(
		v = new Vector(),
		operation = (a, b) => a && b
	) {
		return this.map(
			(c, i) =>
				operation(
					c,
					v[i] ?? 0
				)
		);
	}

	add(v) {
		return this.#merge(v, add);
	}

	sub(v) {
		return this.#merge(v, sub);
	}

	mul(v) {
		return this.#merge(v, mul);
	}

	dot(v) {
		return this.mul(v).reduce(add);
	}

	// TODO: remove?
	div(v) {
		return this.#merge(v, div);
	}

	// 3D only... this might need to be changed?
	// 2D (XY) rotation requires Z axis (kinda)
	// what about arbitrary dimensions?  4D rotation
	// would require a plane to represent the axis,
	// of rotation, no?
	// TO BE EXPLORED in the future!!
	cross(v) {
		const {
			x: a1,
			y: a2,
			z: a3
		} = this;
		const {
			x: b1,
			y: b2,
			z: b3
		} = v;

		return new Vector(
			a2 * b3 - a3 * b2,
			a3 * b1 - a1 * b3,
			a1 * b2 - a2 * b1
		);
	}

	scale(f) {
		return this.map(
			a => a * f
		);
	}

	dist(v) {
		return this.sub(v).magnitude;
	}
}