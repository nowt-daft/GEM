import { Model, Void } from "../gem.js";

export default Model(
	"B",
	{
		name: String,
		age: Number,
		is_tall: false,

		init: {
			params: {
				name: String,
				age: Number,
			},
			method(name, age) {
				Object.assign(
					this,
					{
						name, age
					}
				);
			},
			// returns: Void
		},

		set_height: {
			description: "Set the height of b in cm. Returns true if the person is tall.",
			params: {
				height: Number
			},
			method(
				height = 100
			) {
				return (this.is_tall = height >= 180);
			},
			returns: Boolean
		}
	}
);
