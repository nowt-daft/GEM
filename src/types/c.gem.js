import { Compose } from "../gem.js";
import A from "./a.gem.js";
import B from "./b.gem.js";

export default class C extends Compose(
	[A, B]
) {
	constructor() {
		// this.super(
		// 	{
		// 		property: "Hello, World",
		// 		value: 42
		// 	},
		// 	["Jane Doe", 16]
		// );
	}
}
