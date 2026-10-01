import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 */
export default class MultiInheritError extends GenericError {
	/**
	 * @param  {new T}  type
	 * @param  {(new *)[]}  parents 
	 * @param  {any[]}  arg_collection 
	 */
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

