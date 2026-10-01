import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 * @template U
 */
export default class InheritError extends GenericError {
	/**
	 * @param  {new T}  type
	 * @param  {new U}  parent
	 */
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

