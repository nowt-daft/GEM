import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 */
export default class ParseError extends GenericError {
	/**
	 * @param  {new T}  type
	 * @param  {any}    value
	 */
	constructor(
		type,
		value,
	) {
		super(
			tag`${ type } Parse Error`,
			tag`${ value } cannot be parsed as a ${ type }`
		);
	}
}
