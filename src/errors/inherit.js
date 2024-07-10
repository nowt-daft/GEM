import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

export default class InheritError extends GenericError {
	constructor(
		type,
		parent
	) {
		super(
			"Parent Inheritence Error",
			tag`${ parent } is not defined as a parent of ${ type }.`
		);
	}
}

