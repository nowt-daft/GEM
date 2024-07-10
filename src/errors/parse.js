import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

export default class ParseError extends GenericError {
	/**
	 * @param {class}  type
	 * @param {any}    value
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
