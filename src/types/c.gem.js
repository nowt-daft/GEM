import { Compose } from "../gem.js";
import A from "./a.gem.js";
import B from "./b.gem.js";

export default class C extends Compose(
	[A, B]
) {
	constructor() {
		super();
	}
}


