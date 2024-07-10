import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

export default class MultiInheritError extends GenericError {
	constructor(
		type,
		parents,
		arg_collection
	) {
		super(
			"Multiple Inheritence Error",
			tag`${ type } has ${ parents.length } parents defined but argument ` +
			tag`collection is of size ${ arg_collection.length }.`
		);
	}
}

